<template lang="jade">
svg.main
  svg.list
    svg.item(v-for="(item, i) in items" v-bind:key="item" v-bind:y="145.5 * i")
      foreignObject.youtube-player-container
        YoutubePlayer
      line.separator(v-if="i !== items.length - 1" x1="0px" y1="144.5px" x2="100%" y2="144.5px")
</template>

<script>
import YoutubePlayer from 'components/YoutubePlayer.vue'

export default {
  components: {
    YoutubePlayer
  },
  data: () => ({
    items: ['a', 'b', 'c', 'd', 'e']
  })
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
