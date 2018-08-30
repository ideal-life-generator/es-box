import bus from 'events-bus'
import {
  YOUTUBE_VIDEO_PLAYER_RESIZE
} from 'containers/YoutubeVideo.vue'

export const YOUTUBE_PLAYER_SET_COORDINATES = 'YOUTUBE_PLAYER@SET_COORDINATES'
export const YOUTUBE_PLAYER_SET_SIZE = 'YOUTUBE_PLAYER@SET_SIZE'

export default {
  state: {
    x: 980,
    y: 150,
    width: 500,
    height: 500 * 0.5625
  },
  getters: {
    youtubePlayer: state => state
  },
  mutations: {
    [YOUTUBE_PLAYER_SET_COORDINATES]: (state, { x, y }) => {
      Object.assign(state, { x, y })
    },
    [YOUTUBE_PLAYER_SET_SIZE]: (state, { width, height }) => {
      Object.assign(state, { width, height })

      bus.$emit(YOUTUBE_VIDEO_PLAYER_RESIZE, width, height)
    }
  }
}
