<template lang="pug">
svg
  video-item(
    v-for="(item, i) in items"
    v-bind:key="item.id"
    v-bind:height="itemHeight"
    v-bind:y="itemHeight * i"
    v-bind:playerX="size.mainX + size.resultsX"
    v-bind:playerY="size.mainY + size.resultsY + (itemHeight * i)"
    v-bind="item"
  )
  text.loading(v-show="loading" x="50" y="50") loading
</template>

<script>
import { mapGetters } from 'vuex'
import { search } from 'store/search-results'
import VideoItem from '../VideoItem.vue'

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
