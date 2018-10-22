<template lang="pug">
div.playlist(
  v-on:dragover="onDragOver"
  v-on:drop="onDrop(...arguments, this)"
)
  div.items-container(
    v-if="playlistSongs.total > 0"
  )
    div.item(
      v-for="(item, i) in playlistSongs.items"
      v-bind:key="`${i}-${item.youtubeVideoId}`"
      v-bind:class="{ active: isActiveItem(item) }"
      v-bind:data-i="i"
      draggable="true"
      v-on:dragstart="onDragStart(item, i, ...arguments)"
    )
      div.playback
        play-icon.play(
          v-if="!player.play || (player.play && !isActiveItem(item))"
          v-bind:size="21"
          v-on:click.native="play(item)"
        )
        pause-icon.pause(
          v-else
          v-bind:size="21"
          v-on:click.native="pause(item)"
        )
      div.title(v-text="item.youtubeVideo.title")
  div(v-else) No items found
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
import {
  PLAYLIST,
  PLAYER_SET_ITEM_ACTION,
} from 'store/player'
import { COUNTER_UPDATE } from 'store/counter'
import {
  PLAYLISTS_MENU_SET_CURRENT_ITEM_INDEX_MUTATION,
  PLAYLISTS_MENU_SET_CURRENT_PLAYLIST_ID_MUTATION,
  PLAYLISTS_MENU_SET_CURRENT_ACTION
} from 'store/playlists-menu'
import {
  fetchPlaylistSongs,
  addPlaylistSong,
  removePlaylistSong,
  movePlaylistSong,
  SONGS_ACTIONS_PLAY,
  SONGS_ACTIONS_PAUSE,
  SONGS_ACTION_SHUFFLE_PLAYLIST_SONGS,
  SONGS_ACTION_UNSHUFFLE_PLAYLIST_SONGS,
} from 'store/songs'
import bus from 'events-bus'
import { store } from '/'
import { SHOW_ERROR } from 'store/error'

export default {
  computed: {
    ...mapGetters([
      'player',
      'currentPlaylistSettings',
      'currentPlaylistId',
      'currentItemId',
      'currentItemIndex',
      'songs',
      'playlistSongs',
    ]),
    count() {
      return this.videoItems.length
    },
    playlistId() {
      return `playlists/${this.$route.params._key}`
    },
    items() {
      if (this.player.shuffle) {
        return this.shuffle.map(i => this.extendedItems[i])
      }

      return this.extendedItems
    }
  },
  methods: {
    isActiveItem({
      youtubeVideo: {
        _id: youtubeVideoId,
      },
      inPlaylistAs: {
        index,
      },
    }) {
      const {
        player: {
          itemIn,
          item,
        },
      } = this

      return itemIn === PLAYLIST && item.inPlaylistAs.index === index && (item && item.youtubeVideo._id === youtubeVideoId)
    },
    play(item) {
      if (!this.player.item.youtubeVideo._id || this.player.item.youtubeVideo._id !== item._id) {
        this.$store.dispatch(SONGS_ACTIONS_PLAY, item)
      } else {
        this.$store.dispatch(SONGS_ACTIONS_PLAY)
      }
    },
    pause() {
      this.$store.dispatch(SONGS_ACTIONS_PAUSE)
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
    onDragStart(item, index, event) {
      event.dataTransfer.setData('text/plain', JSON.stringify({
        item,
        currentIndex: index,
        type: 'MOVE'
      }))
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
          if (currentIndex < itemIndex) {
            index = itemIndex - 1
          } else {
            index = itemIndex
          }
        } else {
          if (currentIndex < itemIndex) {
            index = itemIndex
          } else {
            index = itemIndex + 1
          }
        }
      } else {
        index = this.playlistSongs.total
      }

      if (type === 'INSERT') {
        this.addItem(item.youtubeVideo._id, typeof index === 'number' ? index : this.playlistSongs.items.length + 1)
      } else {
        this.moveItem(item.inPlaylistAs._id, currentIndex, index)
      }
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
      if (this.player.shuffle) {
        this.$store.dispatch(SONGS_ACTION_SHUFFLE_PLAYLIST_SONGS)
      } else {
        this.$store.dispatch(SONGS_ACTION_UNSHUFFLE_PLAYLIST_SONGS)
      }
    },
    async addItem(youtubeVideoId, index) {
      const { playlistId } = this

      await this.$store.dispatch(addPlaylistSong.ACTION_TYPE, {
        playlistId,
        youtubeVideoId,
        index,
      })
    },
    async removeItem(itemId) {
      const { playlistId } = this

      await this.$store.dispatch(removePlaylistSong.ACTION_TYPE, {
        playlistId,
        itemId,
      })
    },
    async moveItem(inPlaylistAsId, currentIndex, nextIndex) {
      const { playlistId } = this

      await this.$store.dispatch(movePlaylistSong.ACTION_TYPE, {
        playlistId,
        inPlaylistAsId,
        currentIndex,
        nextIndex,
      })
    },
  },
  beforeRouteEnter(from, to, next) {
    store.dispatch(fetchPlaylistSongs.ACTION_TYPE, `playlists/${from.params._key}`)
    next()
  },
  beforeRouteUpdate(from, to, next) {
    store.dispatch(fetchPlaylistSongs.ACTION_TYPE, `playlists/${from.params._key}`)
    next()
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
