<template lang="pug">
svg.video-player(v-bind:x="0" v-bind:y="0")
  //- rect.background
  foreignObject.video-wrapper(v-bind:x="0" v-bind:y="0")
    //- video.video(ref="video" v-on:click="togglePlayback")
      //- source(type="video/mp4" v-bind:src="source" crossorigin="use-credentials")
</template>

<script>
import youtubePlayer from 'youtube-player'

export default {
  props: {
    x: { type: Number },
    y: { type: Number },
    source: { type: String },
  },
  data: () => ({
    play: false,
  }),
  methods: {
    togglePlayback() {
      const { $refs: { video } } = this

      this.play = !this.play

      if (this.play) video.play()
      else video.pause()

      this.$emit('play', this.play)
    },
  },
  mounted() {
    this.$parent.$on('play', play => {
      const { $refs: { video } } = this

      this.play = play

      if (this.play) video.play()
      else video.pause()
    })
  }
}
</script>

<style lang="sass">
$video-proportion: 0.5625
$width: 220px
$height: $width * $video-proportion

.video-player
  width: $width
  height: $height

  // .background
  //   width: $width
  //   height: $height

  .video-wrapper
    width: $width
    height: $height

    .video
      // width: 125%
      // height: 125%
      position: absolute
      left: 50px


</style>
