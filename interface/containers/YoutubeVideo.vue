<template lang="pug">
div.youtube-player
  div#youtube-player
</template>

<script>
import { mapGetters } from 'vuex'
import YoutubePlayer from 'youtube-player'
import bus from 'events-bus'
import {
  PLAYER_ON_SET_ITEM,
  PLAYER_ON_PLAY,
  PLAYER_ON_PAUSE
} from 'containers/Player.vue'
import { getIdFromUrl } from 'utils/youtube'

export const YOUTUBE_VIDEO_PLAYER_SET_VIDEO_ID = 'YOUTUBE_VIDEO_PLAYER@SET_VIDEO_ID'
export const YOUTUBE_VIDEO_PLAYER_CUET_VIDEO_ID = 'YOUTUBE_VIDEO_PLAYER@CUET_VIDEO_ID'
export const YOUTUBE_VIDEO_PLAYER_SET_AND_PLAY = 'YOUTUBE_VIDEO_PLAYER@SET_AND_PLAY'
export const YOUTUBE_VIDEO_PLAYER_PLAY = 'YOUTUBE_VIDEO_PLAYER@PLAY'
export const YOUTUBE_VIDEO_PLAYER_UNSTARTED = 'YOUTUBE_VIDEO_PLAYER@UNSTARTED'
export const YOUTUBE_VIDEO_PLAYER_ENDED = 'YOUTUBE_VIDEO_PLAYER@ENDED'
export const YOUTUBE_VIDEO_PLAYER_PLAYING = 'YOUTUBE_VIDEO_PLAYER@PLAYING'
export const YOUTUBE_VIDEO_PLAYER_PAUSE = 'YOUTUBE_VIDEO_PLAYER@PAUSE'
export const YOUTUBE_VIDEO_PLAYER_BUFFERING = 'YOUTUBE_VIDEO_PLAYER@BUFFERING'
export const YOUTUBE_VIDEO_PLAYER_VIDEO_CUED = 'YOUTUBE_VIDEO_PLAYER@VIDEO_CUED'

export default {
  data: () => {
    const proportion = 0.5625
    const width = 485

    return {
      width: width,
      height: `${width * proportion}`,
      play: false
    }
  },
  computed: {
    ...mapGetters([
      'player',
      'currentItemId'
    ]),
    playerVideoId() {
      return this.$store.state.player._id
    },
  },
  methods: {
    async getVideoId() {
      return getIdFromUrl(await this.youtubePlayer.getVideoUrl())
    },
    async stateChange({ data: status }) {
      const videoId = await this.getVideoId()

      switch (status) {
        case -1: {
          bus.$emit(YOUTUBE_VIDEO_PLAYER_UNSTARTED, videoId)

          break
        }
        case 0: {
          bus.$emit(YOUTUBE_VIDEO_PLAYER_ENDED, videoId)

          break
        }
        case 1: {
          bus.$emit(YOUTUBE_VIDEO_PLAYER_PLAYING, videoId)

          break
        }
        case 2: {
          bus.$emit(YOUTUBE_VIDEO_PLAYER_PAUSE, videoId)

          break
        }
        case 3: {
          bus.$emit(YOUTUBE_VIDEO_PLAYER_BUFFERING, videoId)

          break
        }
        case 5: {
          bus.$emit(YOUTUBE_VIDEO_PLAYER_VIDEO_CUED, videoId)

          break
        }
      }
    },
    [YOUTUBE_VIDEO_PLAYER_SET_VIDEO_ID]() {
      this.youtubePlayer.cueVideoById(this.currentItemId)
    },
    // onCuetVideoId() {
    //   this.youtubePlayer.cueVideoById(this.playerVideoId)

    //   this.youtubePlayer.playVideo()
    // },
    togglePlayback() {
      const { $refs: { video } } = this

      this.play = !this.play

      if (this.play) video.play()
      else video.pause()

      bus.$emit('youtube-video@play', this.play)
    },
    async [YOUTUBE_VIDEO_PLAYER_PLAY](id, load) {
      if (load) {
        await this.youtubePlayer.pauseVideo()

        setTimeout(() => this.youtubePlayer.loadVideoById(id), 50)
      } else {
        this.youtubePlayer.playVideo()
      }
    },
    [YOUTUBE_VIDEO_PLAYER_PAUSE]() {
      this.youtubePlayer.pauseVideo()
    },
    onStop() {
      this.youtubePlayer.pauseVideo()
    },
    async onSetAndPlay() {
      const videoId = await this.getVideoId()

      await this.youtubePlayer.pauseVideo()

      setTimeout(() => this.youtubePlayer.loadVideoById(this.playerVideoId), 10)

      // this.youtubePlayer.playVideo()
    }
  },
  mounted() {
    this.youtubePlayer = YoutubePlayer('youtube-player', {
      videoId: this.player._id,
      width: this.width,
      height: this.height
    })

    this.youtubePlayer.on('stateChange', this.stateChange)

    bus.$on('stop', this.onStop)

    bus.$on(YOUTUBE_VIDEO_PLAYER_SET_VIDEO_ID, this[YOUTUBE_VIDEO_PLAYER_SET_VIDEO_ID])
    // bus.$on(YOUTUBE_VIDEO_PLAYER_CUET_VIDEO_ID, this.onCuetVideoId)
    bus.$on(YOUTUBE_VIDEO_PLAYER_SET_AND_PLAY, this.onSetAndPlay)
    // bus.$on(YOUTUBE_VIDEO_PLAYER_PLAY, this.onPlayerPlay)
    bus.$on(PLAYER_ON_SET_ITEM, this[YOUTUBE_VIDEO_PLAYER_SET_VIDEO_ID])
    bus.$on(PLAYER_ON_PLAY, this[YOUTUBE_VIDEO_PLAYER_PLAY])
    bus.$on(PLAYER_ON_PAUSE, this[YOUTUBE_VIDEO_PLAYER_PAUSE])
    // bus.$on('player@previous', this.onChangeId)
    // bus.$on('player@next', this.onChangeId)
  },
  unmounted() {
    this.youtubePlayer.off('stateChange', this.stateChange)

    bus.$off('stop', this.onStop)

    bus.$off(YOUTUBE_VIDEO_PLAYER_SET_VIDEO_ID, this[YOUTUBE_VIDEO_PLAYER_SET_VIDEO_ID])
    // bus.$off(YOUTUBE_VIDEO_PLAYER_CUET_VIDEO_ID, this.onCuetVideoId)
    bus.$off(YOUTUBE_VIDEO_PLAYER_SET_AND_PLAY, this.onSetAndPlay)
    // bus.$off(YOUTUBE_VIDEO_PLAYER_PLAY, this.onPlayerPlay)
    bus.$off(PLAYER_ON_SET_ITEM, this[YOUTUBE_VIDEO_PLAYER_SET_VIDEO_ID])
    bus.$off(PLAYER_ON_PLAY, this[YOUTUBE_VIDEO_PLAYER_PLAY])
    bus.$off(PLAYER_ON_PAUSE, this[YOUTUBE_VIDEO_PLAYER_PAUSE])
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
  top: 100px
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
