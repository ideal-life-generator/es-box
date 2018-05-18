<template lang="jade">
svg.video-player
  rect.background
  foreignObject.video-wrapper(v-bind:y="y * 1.25")
    video.video(ref="video" v-on:click="togglePlayback")
      source(type="video/mp4" v-bind:src="source")
</template>

<script>
import youtubePlayer from 'youtube-player'

export default {
  props: {
    y: { type: Number, required: true },
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

  .background
    width: $width
    height: $height

  .video-wrapper
    width: $width
    height: $height

    .video
      width: 125%
      height: 125%

</style>
