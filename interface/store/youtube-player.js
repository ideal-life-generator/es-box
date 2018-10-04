import bus from 'events-bus'
import {
  YOUTUBE_VIDEO_PLAYER_RESIZE
} from 'containers/YoutubeVideo.vue'
import {
  PLAYER_PLAY_ACTION,
  PLAYER_PAUSE_ACTION,
} from 'store/player'

const { assign } = Object

export const STATUS_UNSTARTED = 'STATUS_UNSTARTED'
export const STATUS_ENDED = 'STATUS_ENDED'
export const STATUS_PLAYING = 'STATUS_PLAYING'
export const STATUS_PAUSE = 'STATUS_PAUSE'
export const STATUS_BUFFERING = 'STATUS_BUFFERING'
export const STATUS_VIDEO_CUED = 'STATUS_VIDEO_CUED'

export const YOUTUBE_PLAYER_MUTATIONS_SET_COORDINATES = 'YOUTUBE_PLAYER_MUTATIONS@SET_COORDINATES'
export const YOUTUBE_PLAYER_MUTATIONS_SET_SIZE = 'YOUTUBE_PLAYER_MUTATIONS@SET_SIZE'
export const YOUTUBE_PLAYER_MUTATIONS_SET_VIDEO_ID = 'YOUTUBE_PLAYER_MUTATIONS@SET_VIDEO_ID'
export const YOUTUBE_PLAYER_MUTATIONS_CHANGE_STATUS = 'YOUTUBE_PLAYER_MUTATIONS@CHANGE_STATUS'

export const YOUTUBE_PLAYER_ACTIONS_CHANGE_STATUS = 'YOUTUBE_PLAYER_ACTIONS@CHANGE_STATUS'
export const YOUTUBE_PLAYER_ACTIONS_SET_VIDEO_ID = 'YOUTUBE_PLAYER_ACTIONS@SET_VIDEO_ID'

export default {
  state: {
    x: 980,
    y: 150,
    width: 500,
    height: 500 * 0.5625,
    videoId: null,
    status: null,
    statuses: {
      UNSTARTED: STATUS_UNSTARTED,
      ENDED: STATUS_ENDED,
      PLAYING: STATUS_PLAYING,
      PAUSE: STATUS_PAUSE,
      BUFFERING: STATUS_BUFFERING,
      VIDEO_CUED: STATUS_VIDEO_CUED,
    },
  },
  getters: {
    youtubePlayer: state => state,
  },
  mutations: {
    [YOUTUBE_PLAYER_MUTATIONS_SET_VIDEO_ID]: videoId => assign({
      videoId,
    }),
    [YOUTUBE_PLAYER_MUTATIONS_SET_COORDINATES]: (state, { x, y }) => assign(state, {
      x,
      y,
    }),
    [YOUTUBE_PLAYER_MUTATIONS_SET_SIZE]: (state, { width, height }) => {
      assign(state, { width, height })

      bus.$emit(YOUTUBE_VIDEO_PLAYER_RESIZE, width, height)
    },
    [YOUTUBE_PLAYER_MUTATIONS_CHANGE_STATUS]: (state, status) => assign(state, {
      status,
    }),
  },
  actions: {
    [YOUTUBE_PLAYER_MUTATIONS_SET_VIDEO_ID]: ({ commit }, videoId) => {
      commit(YOUTUBE_PLAYER_MUTATIONS_SET_VIDEO_ID, videoId)
    },
    [YOUTUBE_PLAYER_ACTIONS_CHANGE_STATUS]: ({ commit, dispatch, rootState }, { status, videoId }) => {
      commit(YOUTUBE_PLAYER_MUTATIONS_CHANGE_STATUS, status)

      switch (status) {
        // case STATUS_UNSTARTED: {
        //   dispatch(PLAYER_UNSTARTED_ACTION)

        //   break
        // }
        // case STATUS_ENDED: {
        //   dispatch(PLAYER_ENDED_ACTION)

        //   break
        // }
        case STATUS_PLAYING: {
          dispatch(PLAYER_PLAY_ACTION)

          break
        }
        case STATUS_PAUSE: {
          if (rootState.player.item.youtubeVideo._id === videoId) {
            dispatch(PLAYER_PAUSE_ACTION, videoId)
          }

          break
        }
        // case STATUS_BUFFERING: {
        //   dispatch(PLAYER_BUFFERING_ACTION)

        //   break
        // }
        // case STATUS_VIDEO_CUED: {
        //   dispatch(PLAYER_VIDEO_CUED_ACTION)

        //   break
        // }
      }
    },
  },
}
