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
  PLAYER_PLAY,
  PLAYER_PREVIOUS,
  PLAYER_ON_PREVIOUS,
  PLAYER_NEXT
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
    play(item) {
      bus.$emit(PLAYER_PLAY, item)
      this.updateCounter(item._id)
    },
    updateCounter(_id) {
      const currentItemIndex = this.searchResults.items.findIndex(item => _id === item._id)
      this.$store.commit(COUNTER_UPDATE_CURRENT, currentItemIndex)
    },
    onPlay(item) {
      this.play(item)
    },
    onPause(item) {
      this.pause(item)
    },
    onDragStart(item, event) {
      event.dataTransfer.setData('text/plain', JSON.stringify({ type: 'INSERT', data: item }));
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
    async onPlayerPrevious() {
      const { items, count, total, currentItemIndex } = this.searchResults

      let nextIndex
      if (currentItemIndex > 0) {
        nextIndex = currentItemIndex - 1
      } else {
        nextIndex = 0
      }

      const { items: { [nextIndex]: nextItem } } = this.searchResults

      if (nextItem) {
        this.play(nextItem)

        if (this.player.play) {
          bus.$emit(YOUTUBE_VIDEO_PLAYER_SET_AND_PLAY)
        } else {
          bus.$emit(YOUTUBE_VIDEO_PLAYER_SET_VIDEO_ID)
        }
      }
    },
    async onPlayerNext() {
      const { items, count, total, currentItemIndex } = this.searchResults

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
        const { _id, title } = nextItem

        this.$store.dispatch(PLAYER_SET_ITEM_ACTION, { _id, title })
        this.updateCounter(nextItem._id)

        if (this.player.play) {
          bus.$emit(YOUTUBE_VIDEO_PLAYER_SET_AND_PLAY)
        } else {
          bus.$emit(YOUTUBE_VIDEO_PLAYER_SET_VIDEO_ID)
        }
      }
    }
  },
  async mounted() {
    window.addEventListener('scroll', this.onScroll)

    bus.$on(PLAYER_NEXT, this.onPlayerNext)
    bus.$on(PLAYER_PREVIOUS, this.onPlayerPrevious)

    this.$store.commit(CLEAR_MUTATION)

    await this.$store.dispatch(REQUEST_ACTION)

    bus.$emit(YOUTUBE_VIDEO_PLAYER_SET_VIDEO_ID)
  },
  unmounted() {
    window.removeEventListener('scroll', this.onScroll)

    bus.$off(PLAYER_NEXT, this.onPlayerNext)
    bus.$off(PLAYER_PREVIOUS, this.onPlayerPrevious)
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

  .item
    border-bottom: 1px solid white
    box-sizing: border-box
    cursor: pointer

  .loading
    position: absolute
    bottom: 0px

</style>
