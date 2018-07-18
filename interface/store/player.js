const { assign } = Object

export const PLAYER_PLAYBACK_MUTATION = 'PLAYER@PLAYBACK'
export const REPEAT_ONE_MUTATION = 'PLAYER@REPEAT_ONE'
export const PLAYER_SET_ITEM_ACTION = 'PLAYER@SET_ITEM'
export const PLAYER_PLAY_ACTION = 'PLAYER@PLAY'
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
    [PLAYER_PLAYBACK_MUTATION]: (state, play) => {
      state.play = play
    },
    [REPEAT_ONE_MUTATION]: (state, value) => {
      state.repeatOne = value
    }
  },
  actions: {
    [PLAYER_SET_ITEM_ACTION]: ({ state }, { _id, title }) => {
      assign(state, { _id, title })
    },
    [PLAYER_PLAY_ACTION]: ({ dispatch, commit }, item) => {
      dispatch(PLAYER_SET_ITEM_ACTION, item)

      commit(PLAYER_PLAYBACK_MUTATION, true)
    },
    [CLEAR_ACTION]: ({ dispatch, commit }) => {
      commit(PLAYER_PLAYBACK_MUTATION, false)

      dispatch(PLAYER_SET_ITEM_ACTION, { _id: null, title: '' })
    },
    [TOGGLE_REPEAT_ONE_ACTION]: ({ state, commit }) => {
      commit(REPEAT_ONE_MUTATION, !state.repeatOne)
    }
  }
}
