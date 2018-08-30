const { assign } = Object

export const PLAYER_PLAYBACK_MUTATION = 'PLAYER@PLAYBACK'
export const PLAYER_SHUFFLE_MUTATION = 'PLAYER@SHUFFLE'
export const PLAYER_REPEAT_ONE_MUTATION = 'PLAYER@REPEAT_ONE'
export const PLAYER_REPEAT_ALL_MUTATION = 'PLAYER@REPEAT_ALL'
export const PLAYER_SET_ITEM_ACTION = 'PLAYER@SET_ITEM'
export const PLAYER_PLAY_ACTION = 'PLAYER@PLAY'
export const PLAYER_CLEAR_ACTION = 'PLAYER@CLEAR'
export const PLAYER_TOGGLE_SHUFFLE_ACTION = 'PLAYER@TOGGLE_SHUFFLE'
export const PLAYER_TOGGLE_REPEAT_ONE_ACTION = 'PLAYER@TOGGLE_REPEAT_ONE'
export const PLAYER_TOGGLE_REPEAT_ALL_ACTION = 'PLAYER@TOGGLE_REPEAT_ALL'

export default {
  state: {
    playlistId: null,
    _id: null,
    play: false,
    shuffle: false,
    repeatOne: false,
    repeatAll: false,
    title: ''
  },
  getters: {
    player: state => state
  },
  mutations: {
    [PLAYER_PLAYBACK_MUTATION]: (state, play) => {
      state.play = play
    },
    [PLAYER_SHUFFLE_MUTATION]: (state, value) => {
      state.shuffle = value
    },
    [PLAYER_REPEAT_ONE_MUTATION]: (state, value) => {
      state.repeatOne = value
    },
    [PLAYER_REPEAT_ALL_MUTATION]: (state, value) => {
      state.repeatAll = value
    }
  },
  actions: {
    [PLAYER_SET_ITEM_ACTION]: ({ state }, { playlistId, _id, title }) => {
      assign(state, { playlistId, _id, title })
    },
    [PLAYER_PLAY_ACTION]: ({ dispatch, commit }, item) => {
      dispatch(PLAYER_SET_ITEM_ACTION, item)

      commit(PLAYER_PLAYBACK_MUTATION, true)
    },
    [PLAYER_CLEAR_ACTION]: ({ dispatch, commit }) => {
      commit(PLAYER_PLAYBACK_MUTATION, false)

      dispatch(PLAYER_SET_ITEM_ACTION, { _id: null, title: '' })
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
