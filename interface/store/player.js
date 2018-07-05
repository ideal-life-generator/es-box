const { assign } = Object

export const PLAYER_PLAYBACK_MUTATION = 'PLAYER@PLAYBACK'
export const PLAYER_SET_ITEM_MUTATION = 'PLAYER@SET_ITEM'
export const PLAYER_REPEAT_ONE_MUTATION = 'PLAYER@REPEAT_ONE'
export const PLAYER_PLAY_ACTION = 'PLAYER@PLAY'
export const PLAYER_CLEAR_ACTION = 'PLAYER@CLEAR'
export const PLAYER_TOGGLE_REPEAT_ONE_ACTION = 'PLAYER@TOGGLE_REPEAT_ONE'

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
    [PLAYER_SET_ITEM_MUTATION]: (state, { _id, title }) => {
      assign(state, { _id, title })
    },
    [PLAYER_REPEAT_ONE_MUTATION]: (state, value) => {
      state.repeatOne = value
    }
  },
  actions: {
    [PLAYER_PLAY_ACTION]: ({ commit }, item) => {
      commit(PLAYER_SET_ITEM_MUTATION, item)

      commit(PLAYER_PLAYBACK_MUTATION, true)
    },
    [PLAYER_CLEAR_ACTION]: ({ commit }) => {
      commit(PLAYER_PLAYBACK_MUTATION, false)

      commit(PLAYER_SET_ITEM_MUTATION, { _id: null, title: '' })
    },
    [PLAYER_TOGGLE_REPEAT_ONE_ACTION]: ({ state, commit }) => {
      commit(PLAYER_REPEAT_ONE_MUTATION, !state.repeatOne)
    }
  }
}
