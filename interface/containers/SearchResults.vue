<template lang="pug">
div
  video-item(
    v-for="(item, i) in items"
    v-bind:key="item._id"
    v-bind="item"
  )
  div.loading(v-show="loading") loading
</template>

<script>
import { mapGetters } from 'vuex'
import { search } from 'store/search-results'
import VideoItem from './VideoItem.vue'

export default {
  data: () => ({
    itemHeight: 145.5
  }),
  mounted() { this.$store.dispatch(search.TYPE) },
  computed: {
    ...search.gettersMap,
    ...mapGetters([
      'items',
      'count',
      'total',
      'size'
    ])
  },
  components: {
    VideoItem
  }
}
</script>

<style lang="sass">
</style>
