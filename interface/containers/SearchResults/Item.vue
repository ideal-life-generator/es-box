<template lang="jade">
svg.item
  video-player(v-bind:y="playerY" v-bind:source="source" v-bind:play="play" v-on:play="onPlay")
  svg(x="220px" y="0px")
    text.title(v-text="title" x="30" y="12px")
    svg(v-if="!play" v-on:click="emitPlay(true)" x="29" y="25" width="35" height="35" class="playback" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg")
      polygon(points="5 3 19 12 5 21 5 3" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5")
      rect(width="24" height="24" fill="transparent" stroke="none")
    svg(v-else v-on:click="emitPlay(false)" x="29" y="25" width="35" height="35" class="playback" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg")
      rect(x="5" y="3" width="4" height="18" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5")
      rect(x="15" y="3" width="4" height="18" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5")
      rect(width="24" height="24" fill="transparent" stroke="none")
    line.separator(x1="45px" y1="123" x2="100%" y2="123")
</template>

<script>
import { mapGetters } from 'vuex'
import { search } from 'store/search-results'
import VideoPlayer from 'components/VideoPlayer.vue'

export default {
  props: {
    height: { type: Number, required: true },
    playerY: { type: Number, required: true },
    source: { type: String, required: true },
    title: { type: String, required: true },
  },
  data: () => ({
    play: false
  }),
  methods: {
    onPlay(play) {
      this.play = play
    },
    emitPlay(play) {
      this.play = play

      this.$emit('play', this.play)
    }
  },
  components: {
    VideoPlayer
  }
}
</script>

<style lang="sass">
@import '../../styles/theme.sass'

.item
  height: 145.5px

  .title
    fill: $primary-color2

  .playback
    user-select: none
    cursor: pointer

  .youtube-player-container
    width: 265px
    height: 150px

  .separator
    flex-grow: 1
    stroke: black
    stroke-width: 1
    stroke: $primary-color2

</style>
