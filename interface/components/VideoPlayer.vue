<template lang="pug">
div(v-bind:id="_id")
</template>

<script>
import { mapGetters } from 'vuex'
import YoutubePlayer from 'youtube-player'
import bus from 'events-bus'

export default {
  props: {
    _id: { type: String, required: true },
    sourceId: { type: String, required: true },
  },
  data: () => ({
    width: '220',
    height: `${220 * 0.5625}`,
    play: false
  }),
  computed: {
    ...mapGetters([
      'player'
    ]),
  },
  methods: {
    togglePlayback() {
      const { $refs: { video } } = this

      this.play = !this.play

      if (this.play) video.play()
      else video.pause()

      this.$emit('play', this.play)
    },
    stateChange({ data: status }) {
      switch (status) {
        case -1: {
          this.$emit('unstarted')

          break
        }
        case 0: {
          this.$emit('ended')

          break
        }
        case 1: {
          this.$emit('playing')

          break
        }
        case 2: {
          this.$emit('paused')

          break
        }
        case 3: {
          this.$emit('buffering')

          break
        }
        case 5: {
          this.$emit('videoCued')

          break
        }
      }
    },
    onStop(_id) {
      if (_id !== this._id) {
        this.youtubePlayer.pauseVideo()
      }
    }
  },
  mounted() {
    this.youtubePlayer = YoutubePlayer(this._id, {
      videoId: this.sourceId,
      width: this.width,
      height: this.height
    })

    this.youtubePlayer.on('stateChange', this.stateChange)

    bus.$on('stop', this.onStop)
  },
  unmounted() {
    this.youtubePlayer.off('stateChange', this.stateChange)

    bus.$off('stop', this.onStop)
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
