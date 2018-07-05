<template lang="pug">
div.search-results(v-infinite-scroll="onLoadMore" infinite-scroll-disabled="searchResults.loading" infinite-scroll-distance="10")
  video-item(
    v-for="(item, i) in searchResults.items"
    v-bind:key="item._id"
    v-bind="item"
  )
  div.loading(v-show="searchResults.loading") loading
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
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
    VideoItem
  }
}
</script>

<style lang="sass">
.search-results
  position: relative

  .loading
    position: absolute
    bottom: 0px

</style>
