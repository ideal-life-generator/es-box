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
import {
  STATUS_UNSTARTED,
  STATUS_ENDED,
  STATUS_PLAYING,
  STATUS_PAUSE,
  STATUS_BUFFERING,
  STATUS_VIDEO_CUED,
  YOUTUBE_PLAYER_ACTIONS_CHANGE_STATUS,
} from 'store/youtube-player'
import { getIdFromUrl } from 'utils/youtube'

export const YOUTUBE_VIDEO_PLAYER_LOAD = 'YOUTUBE_VIDEO_PLAYER@LOAD'
export const YOUTUBE_VIDEO_PLAYER_RELOAD = 'YOUTUBE_VIDEO_PLAYER@RELOAD'
export const YOUTUBE_VIDEO_PLAYER_PLAY = 'YOUTUBE_VIDEO_PLAYER@PLAY'
export const YOUTUBE_VIDEO_PLAYER_PAUSE = 'YOUTUBE_VIDEO_PLAYER@PAUSE'
export const YOUTUBE_VIDEO_PLAYER_SET = 'YOUTUBE_VIDEO_PLAYER@SET'
export const YOUTUBE_VIDEO_PLAYER_SET_VIDEO_ID = 'YOUTUBE_VIDEO_PLAYER@SET_VIDEO_ID'
export const YOUTUBE_VIDEO_PLAYER_CUET_VIDEO_ID = 'YOUTUBE_VIDEO_PLAYER@CUET_VIDEO_ID'
export const YOUTUBE_VIDEO_PLAYER_SET_AND_PLAY = 'YOUTUBE_VIDEO_PLAYER@SET_AND_PLAY'
export const YOUTUBE_VIDEO_PLAYER_UNSTARTED = 'YOUTUBE_VIDEO_PLAYER@UNSTARTED'
export const YOUTUBE_VIDEO_PLAYER_ENDED = 'YOUTUBE_VIDEO_PLAYER@ENDED'
export const YOUTUBE_VIDEO_PLAYER_PLAYING = 'YOUTUBE_VIDEO_PLAYER@PLAYING'
export const YOUTUBE_VIDEO_PLAYER_BUFFERING = 'YOUTUBE_VIDEO_PLAYER@BUFFERING'
export const YOUTUBE_VIDEO_PLAYER_VIDEO_CUED = 'YOUTUBE_VIDEO_PLAYER@VIDEO_CUED'
export const YOUTUBE_VIDEO_PLAYER_RESIZE = 'YOUTUBE_VIDEO_PLAYER@RESIZE'

export default {
  props: {
    width: { type: Number, required: true },
    height: { type: Number, required: true },
  },
  data: () => {
    // const proportion = 0.5625
    // const width = 485

    return {
      // width: width,
      // height: `${width * proportion}`,
      play: false
    }
  },
  computed: {
    ...mapGetters([
      'player',
      'currentItem',
      'currentItemId',
      'playerCurrentVideoId',
    ]),
    playerVideoId() {
      return this.player.item.youtubeVideo._id
    },
  },
  methods: {
    async getVideoId() {
      return getIdFromUrl(await this.youtubePlayer.getVideoUrl())
    },
    async stateChangePreloadDisabler({ data: status }) {
      if (status === 1) {
        this.youtubePlayer.off(this.stateChangePreloadDisablerListener)

        this.stateChangeListener = this.youtubePlayer.on('stateChange', this.stateChange)
      }
    },
    async stateChange({ data: status }) {
      const { $store: { dispatch } } = this
      const videoId = await this.getVideoId()

      switch (status) {
        // case -1: {
        //   dispatch(YOUTUBE_PLAYER_ACTIONS_CHANGE_STATUS, { status: STATUS_UNSTARTED, videoId })

        //   break
        // }
        // case 0: {
        //   dispatch(YOUTUBE_PLAYER_ACTIONS_CHANGE_STATUS, { status: STATUS_ENDED, videoId })

        //   break
        // }
        case 1: {
          dispatch(YOUTUBE_PLAYER_ACTIONS_CHANGE_STATUS, { status: STATUS_PLAYING, videoId })

          break
        }
        case 2: {
          dispatch(YOUTUBE_PLAYER_ACTIONS_CHANGE_STATUS, { status: STATUS_PAUSE, videoId })

          break
        }
        // case 3: {
        //   dispatch(YOUTUBE_PLAYER_ACTIONS_CHANGE_STATUS, { status: STATUS_BUFFERING, videoId })

        //   break
        // }
        // case 5: {
        //   dispatch(YOUTUBE_PLAYER_ACTIONS_CHANGE_STATUS, { status: STATUS_VIDEO_CUED, videoId })

        //   break
        // }
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
    [YOUTUBE_VIDEO_PLAYER_RESIZE](width, height) {
      this.youtubePlayer.setSize(width, height)
    },
    onStop() {
      this.youtubePlayer.pauseVideo()
    },
    [YOUTUBE_VIDEO_PLAYER_SET_AND_PLAY](id) {
      // const videoId = await this.getVideoId()

      // await this.youtubePlayer.pauseVideo()

      // setTimeout(() => this.youtubePlayer.loadVideoById(this.playerVideoId), 50)
      this.youtubePlayer.loadVideoById(id)

      // this.youtubePlayer.playVideo()
    },
    async [YOUTUBE_VIDEO_PLAYER_SET]() {
      await this.youtubePlayer.loadVideoById(this.playerCurrentVideoId)

      await this.youtubePlayer.stopVideo()
    },
    [YOUTUBE_VIDEO_PLAYER_LOAD]() {
      this.youtubePlayer.loadVideoById(this.playerCurrentVideoId)
    },
    async [YOUTUBE_VIDEO_PLAYER_RELOAD]() {
      await this.youtubePlayer.stopVideo()

      this.youtubePlayer.loadVideoById(this.playerCurrentVideoId)
    },
    [YOUTUBE_VIDEO_PLAYER_PLAY]() {
      setTimeout(this.youtubePlayer.playVideo, 100)
    },
    [YOUTUBE_VIDEO_PLAYER_PAUSE]() {
      this.youtubePlayer.pauseVideo()
    },
  },
  mounted() {
    this.youtubePlayer = YoutubePlayer('youtube-player', {
      videoId: this.playerVideoId,
      width: this.width,
      height: this.height
    })

    this.stateChangeListener = this.youtubePlayer.on('stateChange', this.stateChange)

    bus.$on(YOUTUBE_VIDEO_PLAYER_SET, this[YOUTUBE_VIDEO_PLAYER_SET])
    bus.$on(YOUTUBE_VIDEO_PLAYER_LOAD, this[YOUTUBE_VIDEO_PLAYER_LOAD])
    bus.$on(YOUTUBE_VIDEO_PLAYER_RELOAD, this[YOUTUBE_VIDEO_PLAYER_RELOAD])
    bus.$on(YOUTUBE_VIDEO_PLAYER_PLAY, this[YOUTUBE_VIDEO_PLAYER_PLAY])
    bus.$on(YOUTUBE_VIDEO_PLAYER_PAUSE, this[YOUTUBE_VIDEO_PLAYER_PAUSE])
    bus.$on(YOUTUBE_VIDEO_PLAYER_SET_VIDEO_ID, this[YOUTUBE_VIDEO_PLAYER_SET_VIDEO_ID])
    bus.$on(YOUTUBE_VIDEO_PLAYER_SET_AND_PLAY, this[YOUTUBE_VIDEO_PLAYER_SET_AND_PLAY])
    // bus.$on(YOUTUBE_VIDEO_PLAYER_CUET_VIDEO_ID, this.onCuetVideoId)
    bus.$on(YOUTUBE_VIDEO_PLAYER_RESIZE, this[YOUTUBE_VIDEO_PLAYER_RESIZE])
    bus.$on(PLAYER_ON_SET_ITEM, this[YOUTUBE_VIDEO_PLAYER_SET_VIDEO_ID])
    bus.$on(PLAYER_ON_PLAY, this[YOUTUBE_VIDEO_PLAYER_PLAY])
    // bus.$on('player@previous', this.onChangeId)
    // bus.$on('player@next', this.onChangeId)
  },
  unmounted() {
    this.youtubePlayer.off(this.stateChangeListener)

    bus.$off(YOUTUBE_VIDEO_PLAYER_SET, this[YOUTUBE_VIDEO_PLAYER_SET])
    bus.$off(YOUTUBE_VIDEO_PLAYER_LOAD, this[YOUTUBE_VIDEO_PLAYER_LOAD])
    bus.$off(YOUTUBE_VIDEO_PLAYER_RELOAD, this[YOUTUBE_VIDEO_PLAYER_RELOAD])
    bus.$off(YOUTUBE_VIDEO_PLAYER_PLAY, this[YOUTUBE_VIDEO_PLAYER_PLAY])
    bus.$off(YOUTUBE_VIDEO_PLAYER_PAUSE, this[YOUTUBE_VIDEO_PLAYER_PAUSE])
    bus.$off(YOUTUBE_VIDEO_PLAYER_SET_VIDEO_ID, this[YOUTUBE_VIDEO_PLAYER_SET_VIDEO_ID])
    // bus.$off(YOUTUBE_VIDEO_PLAYER_CUET_VIDEO_ID, this.onCuetVideoId)
    bus.$off(YOUTUBE_VIDEO_PLAYER_SET_AND_PLAY, this[YOUTUBE_VIDEO_PLAYER_SET_AND_PLAY])
    // bus.$off(YOUTUBE_VIDEO_PLAYER_PLAY, this.onPlayerPlay)
    bus.$off(YOUTUBE_VIDEO_PLAYER_RESIZE, this[YOUTUBE_VIDEO_PLAYER_RESIZE])
    bus.$off(PLAYER_ON_SET_ITEM, this[YOUTUBE_VIDEO_PLAYER_SET_VIDEO_ID])
    bus.$off('player@previous', this.onChangeId)
    // bus.$off('player@next', this.onChangeId)
  },
  watch: {
    async currentItem(nextCurrentItem, prevCurrentItem) {
      this.youtubePlayer.off(this.stateChangeListener)
      if (this.stateChangePreloadDisablerListener) {
        this.youtubePlayer.off(this.stateChangePreloadDisablerListener)
      }

      await this.youtubePlayer.cueVideoById(nextCurrentItem.item.youtubeVideo._id)

      this.stateChangePreloadDisablerListener = this.youtubePlayer.on('stateChange', this.stateChangePreloadDisabler)
    },
  }
}
</script>

<style lang="sass">

</style>
