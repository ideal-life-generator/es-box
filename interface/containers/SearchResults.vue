<template lang="pug">
div(
  class="search-results"
)
  div.loading(v-if="searchResults.loading") loading
  div.items-container(v-else-if="searchResults.total > 0")
    div(
      class="item"
      v-for="(item, i) in searchResults.items"
      v-bind:key="item.youtubeVideo._id"
      draggable="true"
      v-on:dragstart="onDragStart(item, ...arguments)"
    )
      div.song(v-bind:class="{ active: isActiveItem(item.youtubeVideo._id) }")
        play-icon.play(
          v-if="!player.play || (player.play && !isActiveItem(item.youtubeVideo._id))"
          v-bind:size="21"
          v-on:click.native="play(item)"
        )
        pause-icon.pause(
          v-else
          v-bind:size="21"
          v-on:click.native="pause()"
        )
        div.title(v-text="item.youtubeVideo.title")
  div(v-else) No items found
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import virtualList from 'vue-virtual-scroll-list'
import { Drag } from 'vue-drag-drop'
import PlayIcon from 'components/icons/Play.vue'
import PauseIcon from 'components/icons/Pause.vue'
import {
  REQUEST_ACTION,
  LOAD_MORE_ACTION,
  CLEAR_MUTATION,
  SET_CURRENT_INDEX_MUTATION
} from 'store/search-results'
import {
  PLAYER_PLAY_ACTION,
  PLAYER_PAUSE_ACTION,
} from 'store/player'
import { COUNTER_UPDATE_CURRENT } from 'store/counter'
import { UPDATE } from 'components/Counter.vue'
import {
  PLAYER_SET_ITEM,
  PLAYER_PLAY,
  PLAYER_PAUSE,
  PLAYER_PREVIOUS,
  PLAYER_ON_PREVIOUS,
  PLAYER_ON_NEXT
} from 'containers/Player.vue'
import {
  YOUTUBE_VIDEO_PLAYER_SET_VIDEO_ID,
  YOUTUBE_VIDEO_PLAYER_CUET_VIDEO_ID,
  YOUTUBE_VIDEO_PLAYER_SET_AND_PLAY,
  YOUTUBE_VIDEO_PLAYER_PLAY,
  YOUTUBE_VIDEO_PLAYER_PAUSE,
} from 'containers/YoutubeVideo.vue'
import Item from './Item.vue'

export default {
  computed: {
    ...mapGetters([
      'searchResults',
      'player',
      'youtubePlayer',
    ]),
  },
  methods: {
    isActiveItem(youtubeVideoId) {
      const {
        player: {
          itemIn,
          item,
        },
      } = this

      return itemIn === 'search' && (item && item.youtubeVideo._id === youtubeVideoId)
    },
    play(item) {
      this.$store.dispatch(PLAYER_PLAY_ACTION, { itemIn: 'search', item })

      this.$bus.$emit(YOUTUBE_VIDEO_PLAYER_PLAY)
    },
    pause() {
      this.$store.dispatch(PLAYER_PAUSE_ACTION)

      this.$bus.$emit(YOUTUBE_VIDEO_PLAYER_PAUSE)
    },
    updateCounter(_id) {
      this.$store.commit(SET_CURRENT_INDEX_MUTATION, _id)
      this.$store.commit(COUNTER_UPDATE_CURRENT, this.searchResults.currentItemIndex)
    },
    onDragStart(item, event) {
      event.dataTransfer.setData('text/plain', JSON.stringify({ type: 'INSERT', item }));
    },
    onLoadMore() {
      return this.$store.dispatch(LOAD_MORE_ACTION)
    },
    onScroll(event, data) {
      const height =  document.documentElement.scrollHeight - document.documentElement.clientHeight

      if (!this.searchResults.loading && height - (height * 0.15)) {
        this.onLoadMore()
      }
    },
    [PLAYER_ON_PREVIOUS]() {
      const { count, total, currentItemIndex } = this.searchResults

      let nextIndex
      if (currentItemIndex > 0) {
        nextIndex = currentItemIndex - 1
      } else {
        nextIndex = 0
      }

      const { items: { [nextIndex]: nextItem } } = this.searchResults

      if (nextItem) {
        if (this.player.play) {
          this.$bus.$emit(PLAYER_PLAY, nextItem)
        } else {
          this.$bus.$emit(PLAYER_SET_ITEM, nextItem)
        }

        this.updateCounter(nextItem._id)
      }
    },
    async [PLAYER_ON_NEXT]() {
      const { count, total, currentItemIndex } = this.searchResults

      let nextIndex
      if (currentItemIndex < total - 1) {
        if (currentItemIndex >= count - 1) {
          await this.onLoadMore()
        }

        nextIndex = currentItemIndex + 1
      } else if (player.repeatAll) {
        nextIndex = 0
      } else {
        nextIndex = total - 1
      }

      const { items: { [nextIndex]: nextItem } } = this.searchResults

      if (nextItem) {
        if (this.player.play) {
          this.$bus.$emit(PLAYER_PLAY, nextItem)
        } else {
          this.$bus.$emit(PLAYER_SET_ITEM, nextItem)
        }

        this.updateCounter(nextItem._id)
      }
    }
  },
  async mounted() {
    // window.addEventListener('scroll', this.onScroll)

    // this.$bus.$on(PLAYER_ON_PREVIOUS, this[PLAYER_ON_PREVIOUS])
    // this.$bus.$on(PLAYER_ON_NEXT, this[PLAYER_ON_NEXT])

    // this.$store.commit(CLEAR_MUTATION)

    // await this.$store.dispatch(REQUEST_ACTION)

    // this.$bus.$emit(YOUTUBE_VIDEO_PLAYER_SET_VIDEO_ID)
  },
  unmounted() {
    window.removeEventListener('scroll', this.onScroll)

    this.$bus.$off(PLAYER_ON_PREVIOUS, this[PLAYER_ON_PREVIOUS])
    this.$bus.$off(PLAYER_ON_NEXT, this[PLAYER_ON_NEXT])
  },
  components: {
    virtualList,
    Drag,
    PlayIcon,
    PauseIcon,
  },
}
</script>

<style lang="sass">
@import '../styles/theme.sass'

.search-results
  position: relative
  background-color: rgba(0, 0, 0, 0.3)
  border: 1px solid white
  border-radius: 5px

  .item
    box-sizing: border-box
    cursor: pointer

  .loading
    position: absolute
    bottom: 0px

.song
  height: 35px
  display: grid
  grid-template-areas: 'play title'
  grid-template-columns: 35px auto

  .play
    grid-area: play
    display: flex
    justify-content: center
    align-items: center

  .title
    grid-area: title
    display: flex
    align-items: center
    white-space: nowrap
    overflow: hidden
    text-overflow: ellipsis

  .playback
    user-select: none
    cursor: pointer

  .youtube-player-container
    width: 265px
    height: 150px

  .play-icon
    margin-left: auto

  &.active
    .title
      color: purple

</style>
