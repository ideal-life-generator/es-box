<template lang="pug">
div.youtube-player
  div#youtube-player
</template>

<script>
import { mapGetters } from 'vuex'
import YoutubePlayer from 'youtube-player'
import bus from 'events-bus'

export default {
  data: () => {
    const proportion = 0.5625
    const width = 200

    return {
      width: width,
      height: `${width * proportion}`,
      play: false
    }
  },
  computed: {
    ...mapGetters([
      'player'
    ]),
    _id() {
      return this.$store.state.player._id
    }
  },
  methods: {
    onSetVideoId() {
      this.youtubePlayer.cueVideoById(this.player._id)
    },
    togglePlayback() {
      const { $refs: { video } } = this

      this.play = !this.play

      if (this.play) video.play()
      else video.pause()

      bus.$emit('youtube-video@play', this.play)
    },
    stateChange({ data: status }) {
      switch (status) {
        case -1: {
          bus.$emit('youtube-video@unstarted')

          break
        }
        case 0: {
          bus.$emit('youtube-video@ended')

          break
        }
        case 1: {
          bus.$emit('youtube-video@playing')

          break
        }
        case 2: {
          bus.$emit('youtube-video@paused')

          break
        }
        case 3: {
          bus.$emit('youtube-video@buffering')

          break
        }
        case 5: {
          bus.$emit('youtube-video@videoCued')

          break
        }
      }
    },
    onPlayerPlay() {
      this.youtubePlayer.playVideo()
    },
    onPlayerPause() {
      this.youtubePlayer.pauseVideo()
    },
    onChangeId() {
      this.youtubePlayer.pauseVideo()

      this.youtubePlayer.cueVideoById(this.player._id)

      // this.youtubePlayer.playVideo()
    },
    onStop() {
      this.youtubePlayer.pauseVideo()
    }
  },
  mounted() {
    this.youtubePlayer = YoutubePlayer('youtube-player', {
      // videoId: this.player._id,
      width: this.width,
      height: this.height
    })

    this.youtubePlayer.on('stateChange', this.stateChange)

    bus.$on('stop', this.onStop)

    bus.$on('player@set-video-id', this.onSetVideoId)
    bus.$on('player@play', this.onPlayerPlay)
    bus.$on('player@pause', this.onPlayerPause)
    bus.$on('player@previous', this.onChangeId)
    bus.$on('player@next', this.onChangeId)
  },
  unmounted() {
    this.youtubePlayer.off('stateChange', this.stateChange)

    bus.$off('stop', this.onStop)

    bus.$off('player@set-video-id', this.onSetVideoId)
    bus.$off('player@play', this.onPlayerPlay)
    bus.$off('player@pause', this.onPlayerPause)
    bus.$off('player@previous', this.onChangeId)
    bus.$off('player@next', this.onChangeId)
  },
}
</script>

<style lang="sass">
$video-proportion: 0.5625
$width: 220px
$height: $width * $video-proportion

.youtube-player
  position: fixed
  top: 150px
  right: 0px

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
