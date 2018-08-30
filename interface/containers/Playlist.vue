<template lang="pug">
div.playlist(
  v-on:dragover="onDragOver"
  v-on:drop="onDrop(...arguments, this)"
)
  div.item(
    v-for="(item, i) in videoItems"
    v-bind:key="`${i}-${item._id}`"
    v-bind:class="{ active: player._id === item._id && currentItemIndex === i }"
    v-bind:data-i="i"
    draggable="true"
    v-on:dragstart="onDragStart(item, i, ...arguments)"
  )
    div.playback
      play-icon.play(
        v-if="!player.play || (player.play && !(player._id === item._id && currentItemIndex === i))"
        v-bind:size="21"
        v-on:click.native="onPlay(item, i)"
      )
      pause-icon.pause(
        v-else
        v-bind:size="21"
        v-on:click.native="onPause(item, i)"
      )
    div.title(v-text="item.title")
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
  query PlaylistSongs($_key: String!) {
    playlistSongs(_key: $_key) {
      items {
        _id
        _key
        youtubeVideoId
      }
      total
    }
  }
`

export default {
  data: () => ({
    items: [],
    total: null,
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
      return this.items.length
    },
  },
  apollo: {
    playlist: {
      query: PLAYLIST_QUERY,
      variables() {
        return {
          _key: this.$route.params._key,
        }
      },
      async result({ data: { items } }) {
        const { items: videoItems } = await api.getVideos(items)
        this.videoItems = videoItems

        // if (this.playlist.ids.length > 0) {
        //   const [{ _id, title }] = this.items

        //   this.$store.dispatch(PLAYER_SET_ITEM_ACTION, { _id, title })

        //   this.currentItemId = _id

        //   bus.$emit(YOUTUBE_VIDEO_PLAYER_SET_VIDEO_ID)

        //   this.$store.commit(COUNTER_UPDATE, { current: 0, count: this.total })
        // }
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
        currentPlaylistId: `playlists/${this.$route.params._key}`,
        currentItemId,
        currentItemIndex
      })
    },
    updateCurrentItemIndex(currentItemIndex) {
      this.$store.commit(PLAYLISTS_MENU_SET_CURRENT_ITEM_INDEX_MUTATION, currentItemIndex)
    },
    updateCounter() {
      this.$store.commit(COUNTER_UPDATE, { current: this.currentItemIndex, total: this.playlist.total })
    },
    onRemove(event) {
      const { currentIndex } = JSON.parse(event.dataTransfer.getData('text/plain'))

      this.removeItem(currentIndex)
    },
    onDragOver(event) {
      event.preventDefault()
    },
    onDrop(event, ...args) {
      event.preventDefault()
      event.stopPropagation()

      const { type, data, currentIndex } = JSON.parse(event.dataTransfer.getData('text/plain'))
      let itemIndex
      if (event.target.closest('[data-i]')) {
        itemIndex = parseFloat(event.target.closest('[data-i]').dataset.i)
      } else {
        itemIndex = 0
      }

      const { top, height } = event.target.getBoundingClientRect()

      let index
      if (event.clientY < top + (height / 2)) {
        index = itemIndex > 0 ? itemIndex - 1 : 0
      } else {
        index = itemIndex
      }

      if (type === 'INSERT') {
        this.addItem(data, index)
      } else {
        this.moveItem(currentIndex, index)
      }
    },
    onDragStart(item, index, event) {
      event.dataTransfer.setData('text/plain', JSON.stringify({
        data: item,
        currentIndex: index,
        type: 'MOVE'
      }))
    },
    [PLAYER_ON_PREVIOUS]() {
      let nextIndex
      if (this.currentItemIndex > 0) {
        nextIndex = this.currentItemIndex - 1
      } else if (this.player.repeatAll) {
        nextIndex = this.playlist.total - 1
      } else {
        nextIndex = 0
      }

      const { [nextIndex]: nextItem } = this.items

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
      if (this.currentItemIndex < this.playlist.total - 1) {
        // if (this.currentItemIndex >= count - 1) {
        //   await this.onLoadMore()
        // }

        nextIndex = this.currentItemIndex + 1
      } else if (this.player.repeatAll) {
        nextIndex = 0
      } else {
        nextIndex = this.playlist.total - 1
      }

      const { [nextIndex]: nextItem } = this.items

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
    async addItem(data, index) {
      try {
        await this.$apollo.mutate({
          mutation: gql`
            mutation(
              $_key: ID!
              $sourceId: ID!
              $index: Int!
            ) {
              addPlaylistItem(
                _key: $_key
                sourceId: $sourceId
                index: $index
              ) {
                _id
                _key
                name
                ids
                total
              }
            }
          `,
          variables: {
            _key: this.$route.params._key,
            sourceId: data._id,
            index
          },
          update: (store, { data: { addPlaylistItem } }) => {
            const data = store.readQuery({
              query: PLAYLIST_QUERY,
              variables: {
                key: this.$route.params._key
              }
            })

            data.playlist = addPlaylistItem

            store.writeQuery({ query: PLAYLIST_QUERY, data })
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
    async removeItem(index) {
      try {
        await this.$apollo.mutate({
          mutation: gql`
            mutation(
              $_key: ID!
              $index: Int!
            ) {
              removePlaylistItem(
                _key: $_key
                index: $index
              ) {
                _id
                _key
                name
                ids
                total
              }
            }
          `,
          variables: {
            _key: this.$route.params._key,
            index
          },
          update: (store, { data: { removePlaylistItem } }) => {
            const data = store.readQuery({
              query: PLAYLIST_QUERY,
              variables: {
                key: this.$route.params._key
              }
            })

            data.playlist = removePlaylistItem

            store.writeQuery({ query: PLAYLIST_QUERY, data })
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
    async moveItem(currentIndex, nextIndex) {
      try {
        await this.$apollo.mutate({
          mutation: gql`
            mutation(
              $_key: ID!
              $currentIndex: Int!
              $nextIndex: Int!
            ) {
              movePlaylistItem(
                _key: $_key
                currentIndex: $currentIndex
                nextIndex: $nextIndex
              ) {
                _id
                _key
                name
                ids
                total
              }
            }
          `,
          variables: {
            _key: this.$route.params._key,
            currentIndex,
            nextIndex
          },
          update: (store, { data: { movePlaylistItem } }) => {
            const data = store.readQuery({
              query: PLAYLIST_QUERY,
              variables: {
                key: this.$route.params._key
              }
            })

            data.playlist = movePlaylistItem

            store.writeQuery({ query: PLAYLIST_QUERY, data })

            this.updateCurrentItemIndex(nextIndex)
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
