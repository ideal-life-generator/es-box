<template lang="pug">
div(
  class="search-results"
  v-infinite-scroll="onLoadMore"
  infinite-scroll-distance="50"
  infinite-scroll-disabled="searchResults.loading"
)
  video-item(
    class="item"
    v-for="(item, i) in searchResults.items"
    v-bind:key="item._id"
    v-bind="item"
  )
  div.loading(v-show="searchResults.loading") loading
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import virtualList from 'vue-virtual-scroll-list'
import { REQUEST_ACTION, LOAD_MORE_ACTION, CLEAR_MUTATION } from 'store/search-results'
import bus from 'events-bus'
import VideoItem from './VideoItem.vue'

export default {
  data: () => ({
    itemHeight: 145.5
  }),
  methods: {
    onLoadMore() {
      this.$store.dispatch(LOAD_MORE_ACTION)
    },
    onScroll(event, data) {
      if (data.end + 1 >= this.searchResults.limit) {
        this.onLoadMore()
      }
    }
  },
  async mounted() {
    this.$store.commit(CLEAR_MUTATION)
    await this.$store.dispatch(REQUEST_ACTION)

    bus.$emit('player@set-video-id')
  },
  computed: {
    ...mapGetters([
      'searchResults'
    ])
  },
  components: {
    virtualList,
    VideoItem
  }
}
</script>

<style lang="sass">
.search-results
  position: relative

  .item
    border-bottom: 1px solid white
    box-sizing: border-box

  .loading
    position: absolute
    bottom: 0px

</style>
