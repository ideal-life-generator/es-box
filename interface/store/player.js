import { SET_CURRENT_INDEX_MUTATION } from 'store/search-results'

const { assign } = Object

export const PLAYBACK_MUTATION = 'PLAYER@PLAYBACK'
export const REPEAT_ONE_MUTATION = 'PLAYER@REPEAT_ONE'
export const SET_ITEM_ACTION = 'PLAYER@SET_ITEM'
export const PLAY_ACTION = 'PLAYER@PLAY'
export const CLEAR_ACTION = 'PLAYER@CLEAR'
export const TOGGLE_REPEAT_ONE_ACTION = 'PLAYER@TOGGLE_REPEAT_ONE'

export default {
  state: {
    _id: null,
    play: false,
    repeatOne: false,
    title: ''
  },
  getters: {
    player: state => state
  },
  mutations: {
    [PLAYBACK_MUTATION]: (state, play) => {
      state.play = play
    },
    [REPEAT_ONE_MUTATION]: (state, value) => {
      state.repeatOne = value
    }
  },
  actions: {
    [SET_ITEM_ACTION]: ({ state, commit }, { _id, title }) => {
      assign(state, { _id, title })

      commit(SET_CURRENT_INDEX_MUTATION, _id)
    },
    [PLAY_ACTION]: ({ dispatch, commit }, item) => {
      dispatch(SET_ITEM_ACTION, item)

      commit(PLAYBACK_MUTATION, true)
    },
    [CLEAR_ACTION]: ({ dispatch, commit }) => {
      commit(PLAYBACK_MUTATION, false)

      dispatch(SET_ITEM_ACTION, { _id: null, title: '' })
    },
    [TOGGLE_REPEAT_ONE_ACTION]: ({ state, commit }) => {
      commit(REPEAT_ONE_MUTATION, !state.repeatOne)
    }
  }
}
