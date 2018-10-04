const { assign } = Object

export const PLAYER_SET_ITEM_MUTATION = 'PLAYER_MUTATIONS@SET_ITEM'
export const PLAYER_PLAYBACK_MUTATION = 'PLAYER_MUTATIONS@PLAYBACK'
export const PLAYER_SHUFFLE_MUTATION = 'PLAYER_MUTATIONS@SHUFFLE'
export const PLAYER_REPEAT_ONE_MUTATION = 'PLAYER_MUTATIONS@REPEAT_ONE'
export const PLAYER_REPEAT_ALL_MUTATION = 'PLAYER_MUTATIONS@REPEAT_ALL'

export const PLAYER_SET_ITEM_ACTION = 'PLAYER_ACTIONS@SET_ITEM'
export const PLAYER_PLAY_ACTION = 'PLAYER_ACTIONS@PLAY'
export const PLAYER_PAUSE_ACTION = 'PLAYER_ACTIONS@PAUSE'
export const PLAYER_CLEAR_ACTION = 'PLAYER_ACTIONS@CLEAR'
export const PLAYER_TOGGLE_SHUFFLE_ACTION = 'PLAYER_ACTIONS@TOGGLE_SHUFFLE'
export const PLAYER_TOGGLE_REPEAT_ONE_ACTION = 'PLAYER_ACTIONS@TOGGLE_REPEAT_ONE'
export const PLAYER_TOGGLE_REPEAT_ALL_ACTION = 'PLAYER_ACTIONS@TOGGLE_REPEAT_ALL'

export default {
  state: {
    itemIn: null,
    item: null,
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
    [PLAYER_PLAY_ACTION]: ({ commit }, song) => {
      if (song) {
        const { itemIn, item } = song

        commit(PLAYER_SET_ITEM_MUTATION, { itemIn, item })
      }

      commit(PLAYER_PLAYBACK_MUTATION, true)
    },
    [PLAYER_PAUSE_ACTION]: ({ commit }) => {
      commit(PLAYER_PLAYBACK_MUTATION, false)
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
