<template lang="pug">
div.playlist(
  v-on:dragover="onDragOver"
  v-on:drop="onDrop(...arguments, this)"
)
  div.item(
    v-for="(videoItem, i) in videoItems"
    v-bind:key="`${i}-${videoItem._id}`"
    v-bind:class="{ active: player._id === videoItem._id && currentItemIndex === i }"
    v-bind:data-i="i"
    draggable="true"
    v-on:dragstart="onDragStart(playlistSongs.items[i], videoItem, i, ...arguments)"
  )
    div.playback
      play-icon.play(
        v-if="!player.play || (player.play && !(player._id === videoItem._id && currentItemIndex === i))"
        v-bind:size="21"
        v-on:click.native="onPlay(videoItem, i)"
      )
      pause-icon.pause(
        v-else
        v-bind:size="21"
        v-on:click.native="onPause(videoItem, i)"
      )
    div.title(v-text="videoItem.title")
</template>

<script>
import { mapGetters } from 'vuex'
import gql from 'graphql-tag'
import api from 'api'
import {
  PLAYER_SET_ITEM,
  PLAYER_PLAY,
  PLAYER_PAUSE,
  PLAYER_PREVIOUS,
  PLAYER_ON_PREVIOUS,
  PLAYER_ON_NEXT,
  PLAYER_ON_SHUFFLE
} from 'containers/Player.vue'
import { YOUTUBE_VIDEO_PLAYER_SET_VIDEO_ID } from 'containers/YoutubeVideo.vue'
import PlayIcon from 'components/icons/Play.vue'
import PauseIcon from 'components/icons/Pause.vue'
import { PLAYER_SET_ITEM_ACTION } from 'store/player'
import { COUNTER_UPDATE } from 'store/counter'
import {
  PLAYLISTS_MENU_SET_CURRENT_ITEM_INDEX_MUTATION,
  PLAYLISTS_MENU_SET_CURRENT_PLAYLIST_ID_MUTATION,
  PLAYLISTS_MENU_SET_CURRENT_ACTION
} from 'store/playlists-menu'
import bus from 'events-bus'
import { SHOW_ERROR } from 'store/error'

const PLAYLIST_QUERY = gql`
  query PlaylistSongs($playlistId: ID!) {
    playlistSongs(playlistId: $playlistId) {
      items {
        song {
          _id
          youtubeVideoId
        }
        inPlaylistAs {
          _id
          index
        }
      }
      total
    }
  }
`

export default {
  data: () => ({
    playlistSongs: {
      items: [],
      total: null
    },
    videoItems: [],
    shuffled: []
  }),
  computed: {
    ...mapGetters([
      'player',
      'currentPlaylistSettings',
      'currentPlaylistId',
      'currentItemId',
      'currentItemIndex'
    ]),
    count() {
      return this.videoItems.length
    },
    playlistId() {
      return `playlists/${this.$route.params._key}`
    }
  },
  apollo: {
    playlistSongs: {
      query: PLAYLIST_QUERY,
      variables() {
        return {
          playlistId: this.playlistId,
        }
      },
      async result({ data: { playlistSongs } }) {
        const youtubeVideoIds = playlistSongs.items.map(item => item.song.youtubeVideoId)

        const { items } = await api.getVideos(youtubeVideoIds)
        this.videoItems = items
      }
    }
  },
  methods: {
    onPlay(item, index) {
      this.play(item, index)
    },
    onPause(item, index) {
      this.pause(item, index)
    },
    play(item, index) {
      this.updateCurrent(item._id, index)

      if (this.player._id === item._id) {
        bus.$emit(PLAYER_PLAY)
      } else {
        bus.$emit(PLAYER_PLAY, item)
      }

      this.updateCounter()
    },
    pause() {
      bus.$emit(PLAYER_PAUSE)
    },
    updateCurrent(currentItemId, currentItemIndex) {
      this.$store.dispatch(PLAYLISTS_MENU_SET_CURRENT_ACTION, {
        currentPlaylistId: this.playlistId,
        currentItemId,
        currentItemIndex
      })
    },
    updateCurrentItemIndex(currentItemIndex) {
      this.$store.commit(PLAYLISTS_MENU_SET_CURRENT_ITEM_INDEX_MUTATION, currentItemIndex)
    },
    updateCounter() {
      this.$store.commit(COUNTER_UPDATE, { current: this.currentItemIndex, total: this.playlistSongs.total })
    },
    onRemove(event) {
      const { item: { inPlaylistAs: { _id } } } = JSON.parse(event.dataTransfer.getData('text/plain'))

      this.removeItem(_id)
    },
    onDragOver(event) {
      event.preventDefault()
    },
    onDrop(event, ...args) {
      event.preventDefault()
      event.stopPropagation()

      const { type, item, currentIndex } = JSON.parse(event.dataTransfer.getData('text/plain'))
      let itemIndex
      let index
      const target = event.target.closest('[data-i]')
      if (target) {
        itemIndex = parseFloat(target.dataset.i)

        const { top, height } = target.getBoundingClientRect()

        if (event.clientY < top + (height / 2)) {
          index = itemIndex
        } else {
          index = itemIndex + 1
        }
      } else {
        index = this.playlistSongs.total
      }

      if (type === 'INSERT') {
        this.addItem(item._id, typeof index === 'number' ? index : this.playlistSongs.items.length + 1)
      } else {
        this.moveItem(item.inPlaylistAs._id, currentIndex, index)
      }
    },
    onDragStart(item, videoItem, index, event) {
      event.dataTransfer.setData('text/plain', JSON.stringify({
        item,
        videoItem,
        currentIndex: index,
        type: 'MOVE'
      }))
    },
    [PLAYER_ON_PREVIOUS]() {
      let nextIndex
      if (this.currentItemIndex > 0) {
        nextIndex = this.currentItemIndex - 1
      } else if (this.player.repeatAll) {
        nextIndex = this.playlistSongs.total - 1
      } else {
        nextIndex = 0
      }

      const { [nextIndex]: nextItem } = this.videoItems

      if (nextItem) {
        if (this.player.play) {
          bus.$emit(PLAYER_PLAY, nextItem)
        } else {
          bus.$emit(PLAYER_SET_ITEM, nextItem)
        }

        this.updateCurrent(nextItem._id, nextIndex)
        this.updateCounter()
      }
    },
    [PLAYER_ON_NEXT]() {
      let nextIndex
      if (this.currentItemIndex < this.playlistSongs.total - 1) {
        // if (this.currentItemIndex >= count - 1) {
        //   await this.onLoadMore()
        // }

        nextIndex = this.currentItemIndex + 1
      } else if (this.player.repeatAll) {
        nextIndex = 0
      } else {
        nextIndex = this.playlistSongs.total - 1
      }

      const { [nextIndex]: nextItem } = this.videoItems

      if (nextItem) {
        if (this.player.play) {
          bus.$emit(PLAYER_PLAY, nextItem)
        } else {
          bus.$emit(PLAYER_SET_ITEM, nextItem)
        }

        this.updateCurrent(nextItem._id, nextIndex)
        this.updateCounter()
      }
    },
    [PLAYER_ON_SHUFFLE]() {
      console.log('shuffle', this.player.shuffle)
    },
    async addItem(youtubeVideoId, index) {
      try {
        await this.$apollo.mutate({
          mutation: gql`
            mutation(
              $playlistId: ID!
              $youtubeVideoId: ID!
              $index: Int
            ) {
              addPlaylistSong(
                playlistId: $playlistId
                youtubeVideoId: $youtubeVideoId
                index: $index
              ) {
                items {
                  song {
                    _id
                    youtubeVideoId
                  }
                  inPlaylistAs {
                    _id
                    index
                  }
                }
                total
              }
            }
          `,
          variables: {
            playlistId: this.playlistId,
            youtubeVideoId,
            index
          },
          update: (store, { data: { addPlaylistSong } }) => {
            const data = store.readQuery({
              query: PLAYLIST_QUERY,
              variables: {
                playlistId: this.playlistId
              }
            })

            data.playlistSongs = addPlaylistSong

            store.writeQuery({
              query: PLAYLIST_QUERY,
              variables: {
                playlistId: this.playlistId
              },
              data
            })
          }
        })
      } catch (error) { // FIXME: Should parse
        console.log(error)

        this.$store.dispatch(SHOW_ERROR,
          (error && error.graphQLErrors && error.graphQLErrors[0] && error.graphQLErrors[0].message) ?
            error.graphQLErrors[0].message : 'Playlist creating is failed'
        )
      }
    },
    async removeItem(itemId) {
      try {
        await this.$apollo.mutate({
          mutation: gql`
            mutation(
              $playlistId: ID!
              $itemId: ID!
            ) {
              removePlaylistSong(
                playlistId: $playlistId
                itemId: $itemId
              ) {
                items {
                  song {
                    _id
                    youtubeVideoId
                  }
                  inPlaylistAs {
                    _id
                    index
                  }
                }
                total
              }
            }
          `,
          variables: {
            playlistId: this.playlistId,
            itemId
          },
          update: (store, { data: { removePlaylistSong } }) => {
            const data = store.readQuery({
              query: PLAYLIST_QUERY,
              variables: {
                playlistId: this.playlistId
              }
            })

            data.playlistSongs = removePlaylistSong

            store.writeQuery({
              query: PLAYLIST_QUERY,
              variables: {
                playlistId: this.playlistId
              },
              data
            })
          }
        })
      } catch (error) { // FIXME: Should parse
        console.log(error)

        this.$store.dispatch(SHOW_ERROR,
          (error && error.graphQLErrors && error.graphQLErrors[0] && error.graphQLErrors[0].message) ?
            error.graphQLErrors[0].message : 'Playlist creating is failed'
        )
      }
    },
    async moveItem(inPlaylistAsId, currentIndex, nextIndex) {
      try {
        await this.$apollo.mutate({
          mutation: gql`
            mutation(
              $playlistId: ID!
              $inPlaylistAsId: ID!
              $currentIndex: Int!
              $nextIndex: Int!
            ) {
              movePlaylistSong(
                playlistId: $playlistId
                inPlaylistAsId: $inPlaylistAsId
                currentIndex: $currentIndex
                nextIndex: $nextIndex
              ) {
                items {
                  song {
                    _id
                    youtubeVideoId
                  }
                  inPlaylistAs {
                    _id
                    index
                  }
                }
                total
              }
            }
          `,
          variables: {
            playlistId: this.playlistId,
            inPlaylistAsId,
            currentIndex,
            nextIndex
          },
          update: (store, { data: { movePlaylistSong } }) => {
            const data = store.readQuery({
              query: PLAYLIST_QUERY,
              variables: {
                playlistId: this.playlistId
              }
            })

            data.playlistSongs = movePlaylistSong

            store.writeQuery({
              query: PLAYLIST_QUERY,
              variables: {
                playlistId: this.playlistId
              },
              data
            })
          }
        })
      } catch (error) { // FIXME: Should parse
        console.log(error)

        this.$store.dispatch(SHOW_ERROR,
          (error && error.graphQLErrors && error.graphQLErrors[0] && error.graphQLErrors[0].message) ?
            error.graphQLErrors[0].message : 'Playlist creating is failed'
        )
      }
    },
  },
  mounted() {
    bus.$on(PLAYER_ON_PREVIOUS, this[PLAYER_ON_PREVIOUS])
    bus.$on(PLAYER_ON_NEXT, this[PLAYER_ON_NEXT])
    bus.$on(PLAYER_ON_SHUFFLE, this[PLAYER_ON_SHUFFLE])

    document.addEventListener('dragover', this.onDragOver)
    document.addEventListener('drop', this.onRemove)
  },
  unmounted() {
    bus.$off(PLAYER_ON_PREVIOUS, this[PLAYER_ON_PREVIOUS])
    bus.$off(PLAYER_ON_NEXT, this[PLAYER_ON_NEXT])
    bus.$off(PLAYER_ON_SHUFFLE, this[PLAYER_ON_SHUFFLE])

    document.removeEventListener('dragover', this.onDragOver)
    document.removeEventListener('drop', this.onRemove)
  },
  components: {
    PlayIcon,
    PauseIcon
  }
}
</script>

<style lang="sass">
.playlist

  .item
    display: grid
    grid-template-columns: 21.6px auto
    grid-template-areas: 'playback title'
    border: 1px solid white

    .playback
      grid-area: playback

    .title
      margin-left: 5px
      grid-area: title
      white-space: nowrap
      overflow: hidden
      text-overflow: ellipsis

    &.active
      .title
        color: purple

</style>
