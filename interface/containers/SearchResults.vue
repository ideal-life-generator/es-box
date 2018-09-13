<template lang="pug">
div(
  class="search-results"
)
  div(
    class="item"
    v-for="(item, i) in searchResults.items"
    v-bind:key="item._id"
    draggable="true"
    v-on:dragstart="onDragStart(item, ...arguments)"
  )
    item(
      v-bind="item"
      v-on:play="onPlay"
      v-on:pause="onPause"
      v-bind:playing="!player.play || (player.play && player._id !== item._id)"
      v-bind:active="player._id === item._id"
    )
  div.loading(v-show="searchResults.loading") loading
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import virtualList from 'vue-virtual-scroll-list'
import { Drag } from 'vue-drag-drop'
import {
  REQUEST_ACTION,
  LOAD_MORE_ACTION,
  CLEAR_MUTATION,
  SET_CURRENT_INDEX_MUTATION
} from 'store/search-results'
import { PLAYER_SET_ITEM_ACTION } from 'store/player'
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
  YOUTUBE_VIDEO_PLAYER_PLAY
} from 'containers/YoutubeVideo.vue'
import bus from 'events-bus'
import Item from './Item.vue'

export default {
  computed: {
    ...mapGetters([
      'searchResults',
      'player'
    ])
  },
  methods: {
    onPlay(item) {
      this.play(item)
    },
    onPause(item) {
      this.pause(item)
    },
    play(item) {
      if (this.player._id === item._id) {
        bus.$emit(PLAYER_PLAY)
      } else {
        bus.$emit(PLAYER_PLAY, item)
        this.updateCounter(item._id)
      }
    },
    pause() {
      bus.$emit(PLAYER_PAUSE)
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
          bus.$emit(PLAYER_PLAY, nextItem)
        } else {
          bus.$emit(PLAYER_SET_ITEM, nextItem)
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
          bus.$emit(PLAYER_PLAY, nextItem)
        } else {
          bus.$emit(PLAYER_SET_ITEM, nextItem)
        }

        this.updateCounter(nextItem._id)
      }
    }
  },
  async mounted() {
    // window.addEventListener('scroll', this.onScroll)

    // bus.$on(PLAYER_ON_PREVIOUS, this[PLAYER_ON_PREVIOUS])
    // bus.$on(PLAYER_ON_NEXT, this[PLAYER_ON_NEXT])

    // this.$store.commit(CLEAR_MUTATION)

    // await this.$store.dispatch(REQUEST_ACTION)

    // bus.$emit(YOUTUBE_VIDEO_PLAYER_SET_VIDEO_ID)
  },
  unmounted() {
    window.removeEventListener('scroll', this.onScroll)

    bus.$off(PLAYER_ON_PREVIOUS, this[PLAYER_ON_PREVIOUS])
    bus.$off(PLAYER_ON_NEXT, this[PLAYER_ON_NEXT])
  },
  components: {
    virtualList,
    Item,
    Drag
  }
}
</script>

<style lang="sass">
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

</style>
