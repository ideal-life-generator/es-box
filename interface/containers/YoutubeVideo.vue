<template lang="pug">
div.youtube-player
  div#youtube-player
</template>

<script>
import { mapGetters } from 'vuex'
import YoutubePlayer from 'youtube-player'
import bus from 'events-bus'
import { PLAYER_PLAY } from 'containers/Player.vue'

export const YOUTUBE_VIDEO_PLAYER_SET_VIDEO_ID = 'YOUTUBE_VIDEO_PLAYER@SET_VIDEO_ID'
export const YOUTUBE_VIDEO_PLAYER_CUET_VIDEO_ID = 'YOUTUBE_VIDEO_PLAYER@CUET_VIDEO_ID'
export const YOUTUBE_VIDEO_PLAYER_PLAY = 'YOUTUBE_VIDEO_PLAYER@PLAY'
export const YOUTUBE_VIDEO_PLAYER_UNSTARTED = 'YOUTUBE_VIDEO_PLAYER@UNSTARTED'
export const YOUTUBE_VIDEO_PLAYER_ENDED = 'YOUTUBE_VIDEO_PLAYER@ENDED'
export const YOUTUBE_VIDEO_PLAYER_PLAYING = 'YOUTUBE_VIDEO_PLAYER@PLAYING'
export const YOUTUBE_VIDEO_PLAYER_PAUSED = 'YOUTUBE_VIDEO_PLAYER@PAUSED'
export const YOUTUBE_VIDEO_PLAYER_BUFFERING = 'YOUTUBE_VIDEO_PLAYER@BUFFERING'
export const YOUTUBE_VIDEO_PLAYER_VIDEO_CUED = 'YOUTUBE_VIDEO_PLAYER@VIDEO_CUED'

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
    stateChange({ data: status }) {
      switch (status) {
        case -1: {
          bus.$emit(YOUTUBE_VIDEO_PLAYER_UNSTARTED)

          break
        }
        case 0: {
          bus.$emit(YOUTUBE_VIDEO_PLAYER_ENDED)

          break
        }
        case 1: {
          bus.$emit(YOUTUBE_VIDEO_PLAYER_PLAYING)

          break
        }
        case 2: {
          bus.$emit(YOUTUBE_VIDEO_PLAYER_PAUSED)

          break
        }
        case 3: {
          bus.$emit(YOUTUBE_VIDEO_PLAYER_BUFFERING)

          break
        }
        case 5: {
          bus.$emit(YOUTUBE_VIDEO_PLAYER_VIDEO_CUED)

          break
        }
      }
    },
    onSetVideoId(_id) {
      this.youtubePlayer.loadVideoById(this._id)
    },
    async onCuetVideoId() {
      await this.youtubePlayer.cueVideoById(this._id)

      console.log('onCuetVideoId')

      this.youtubePlayer.playVideo()
    },
    togglePlayback() {
      const { $refs: { video } } = this

      this.play = !this.play

      if (this.play) video.play()
      else video.pause()

      bus.$emit('youtube-video@play', this.play)
    },
    onPlayerPlay() {
      console.log('onPlayerPlay', this._id)

      this.youtubePlayer.playVideo()
    },
    onPlayerPause() {
      this.youtubePlayer.pauseVideo()
    },
    onStop() {
      this.youtubePlayer.pauseVideo()
    },
    onSetAndPlay() {
      
    }
  },
  mounted() {
    this.youtubePlayer = YoutubePlayer('youtube-player', {
      // videoId: this._id,
      width: this.width,
      height: this.height
    })

    this.youtubePlayer.on('stateChange', this.stateChange)

    bus.$on('stop', this.onStop)

    bus.$on(YOUTUBE_VIDEO_PLAYER_SET_VIDEO_ID, this.onSetVideoId)
    bus.$on(YOUTUBE_VIDEO_PLAYER_CUET_VIDEO_ID, this.onCuetVideoId)
    bus.$on(YOUTUBE_VIDEO_PLAYER_SET_AND_PLAY, this.onSetAndPlay)
    bus.$on(YOUTUBE_VIDEO_PLAYER_PLAY, this.onPlayerPlay)
    bus.$on(PLAYER_PLAY, this.onPlayerPlay)
    bus.$on('player@pause', this.onPlayerPause)
    bus.$on('player@previous', this.onChangeId)
    // bus.$on('player@next', this.onChangeId)
  },
  unmounted() {
    this.youtubePlayer.off('stateChange', this.stateChange)

    bus.$off('stop', this.onStop)

    bus.$off(YOUTUBE_VIDEO_PLAYER_SET_VIDEO_ID, this.onSetVideoId)
    bus.$off(YOUTUBE_VIDEO_PLAYER_CUET_VIDEO_ID, this.onCuetVideoId)
    bus.$off(YOUTUBE_VIDEO_PLAYER_SET_AND_PLAY, this.onSetAndPlay)
    bus.$off(YOUTUBE_VIDEO_PLAYER_PLAY, this.onPlayerPlay)
    bus.$off(PLAYER_PLAY, this.onPlayerPlay)
    bus.$off('player@pause', this.onPlayerPause)
    bus.$off('player@previous', this.onChangeId)
    // bus.$off('player@next', this.onChangeId)
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
