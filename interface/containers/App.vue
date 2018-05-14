<template lang="jade">
svg.main(v-bind:height="145.5 * count")
  svg.list
    svg.item(v-for="(item, i) in items" v-bind:key="item.id" v-bind:y="145.5 * i")
      foreignObject.youtube-player-container
        YoutubePlayer
      text(v-text="item.title" x="15" y="15")
      line.separator(v-if="i !== items.length - 1" x1="0px" y1="144.5px" x2="100%" y2="144.5px")
    text.loading(v-show="loading" x="50" y="50") loading
</template>

<script>
import { mapGetters } from 'vuex'
import { search } from 'store/search-results'
import YoutubePlayer from 'components/YoutubePlayer.vue'

export default {
  mounted() { this.$store.dispatch(search.TYPE) },
  computed: {
    ...search.gettersMap,
    ...mapGetters([
      'items',
      'count',
      'total'
    ])
  },
  components: {
    YoutubePlayer
  }
}
</script>

<style lang="sass">
.main
  margin-left: 150px
  margin-right: 150px
  flex-grow: 1
  display: flex

  .list
    margin-top: 10px
    margin-bottom: 10px
    flex-grow: 1
    display: flex

    .item
      height: 145.5px

      .youtube-player-container
        width: 265px
        height: 150px

      .separator
        flex-grow: 1
        stroke: black
        stroke-width: 1

</style>
