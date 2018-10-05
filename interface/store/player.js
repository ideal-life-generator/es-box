import bus from 'events-bus'
import {
  YOUTUBE_VIDEO_PLAYER_PLAY,
  YOUTUBE_VIDEO_PLAYER_PAUSE,
} from 'containers/YoutubeVideo.vue'
import {
  LOAD_MORE_ACTION,
  SEARCH_RESULTS_ACTIONS_PLAY_PREVIOUS,
  SEARCH_RESULTS_ACTIONS_PLAY_NEXT,
} from 'store/search-results'

const { assign } = Object

export const SEARCH_RESULTS = 'SEARCH_RESULTS'
export const PLAYLIST = 'PLAYLIST'

export const PLAYER_SET_ITEM_MUTATION = 'PLAYER_MUTATIONS@SET_ITEM'
export const PLAYER_PLAYBACK_MUTATION = 'PLAYER_MUTATIONS@PLAYBACK'
export const PLAYER_SHUFFLE_MUTATION = 'PLAYER_MUTATIONS@SHUFFLE'
export const PLAYER_REPEAT_ONE_MUTATION = 'PLAYER_MUTATIONS@REPEAT_ONE'
export const PLAYER_REPEAT_ALL_MUTATION = 'PLAYER_MUTATIONS@REPEAT_ALL'

export const PLAYER_SET_ITEM_ACTION = 'PLAYER_ACTIONS@SET_ITEM'
export const PLAYER_PLAY_ACTION = 'PLAYER_ACTIONS@PLAY'
export const PLAYER_PAUSE_ACTION = 'PLAYER_ACTIONS@PAUSE'
export const PLAYER_PREVIOUS_ACTION = 'PLAYER_ACTIONS@PREVIOUS'
export const PLAYER_NEXT_ACTION = 'PLAYER_ACTIONS@NEXT'
export const PLAYER_CLEAR_ACTION = 'PLAYER_ACTIONS@CLEAR'
export const PLAYER_TOGGLE_SHUFFLE_ACTION = 'PLAYER_ACTIONS@TOGGLE_SHUFFLE'
export const PLAYER_TOGGLE_REPEAT_ONE_ACTION = 'PLAYER_ACTIONS@TOGGLE_REPEAT_ONE'
export const PLAYER_TOGGLE_REPEAT_ALL_ACTION = 'PLAYER_ACTIONS@TOGGLE_REPEAT_ALL'

export default {
  state: {
    itemIn: null,
    item: {
      youtubeVideo: {},
    },
    play: false,
    repeatOne: false,
    repeatAll: false,
    shuffle: false,
  },
  getters: {
    player: state => state,
  },
  mutations: {
    [PLAYER_SET_ITEM_MUTATION]: (state, { itemIn, item }) => assign(state, { itemIn, item }),
    [PLAYER_PLAYBACK_MUTATION]: (state, play) => assign(state, { play }),
    [PLAYER_REPEAT_ONE_MUTATION]: (state, repeatOne) => assign(state, { repeatOne }),
    [PLAYER_REPEAT_ALL_MUTATION]: (state, repeatAll) => assign(state, { repeatAll }),
    [PLAYER_SHUFFLE_MUTATION]: (state, shuffle) => assign(state, { shuffle }),
  },
  actions: {
    [PLAYER_SET_ITEM_ACTION]: ({ commit }, { itemIn, item }) => {
      commit(PLAYER_SET_ITEM_MUTATION, { itemIn, item })
    },
    [PLAYER_PLAY_ACTION]: ({ commit }, song) => {
      if (song) {
        const { itemIn, item } = song

        commit(PLAYER_SET_ITEM_MUTATION, { itemIn, item })
      }

      commit(PLAYER_PLAYBACK_MUTATION, true)

      bus.$emit(YOUTUBE_VIDEO_PLAYER_PLAY)
    },
    [PLAYER_PAUSE_ACTION]: ({ commit }) => {
      commit(PLAYER_PLAYBACK_MUTATION, false)

      bus.$emit(YOUTUBE_VIDEO_PLAYER_PAUSE)
    },
    [PLAYER_PREVIOUS_ACTION]: ({ dispatch, rootState }) => {
      switch (rootState.player.itemIn) {
        case SEARCH_RESULTS: {
          dispatch(SEARCH_RESULTS_ACTIONS_PLAY_PREVIOUS)

          break
        }
      }
    },
    [PLAYER_NEXT_ACTION]: ({ dispatch, rootState }) => {
      switch (rootState.player.itemIn) {
        case SEARCH_RESULTS: {
          dispatch(SEARCH_RESULTS_ACTIONS_PLAY_NEXT)

          break
        }
      }
    },
    [PLAYER_CLEAR_ACTION]: ({ dispatch, commit }) => {
      commit(PLAYER_PLAYBACK_MUTATION, false)

      dispatch(PLAYER_SET_ITEM_ACTION, { itemIn: null, item: null })
    },
    [PLAYER_TOGGLE_SHUFFLE_ACTION]: ({ state, commit }) => {
      commit(PLAYER_SHUFFLE_MUTATION, !state.shuffle)
    },
    [PLAYER_TOGGLE_REPEAT_ONE_ACTION]: ({ state, commit }) => {
      commit(PLAYER_REPEAT_ONE_MUTATION, !state.repeatOne)
    },
    [PLAYER_TOGGLE_REPEAT_ALL_ACTION]: ({ state, commit }) => {
      commit(PLAYER_REPEAT_ALL_MUTATION, !state.repeatAll)
    }
  }
}
