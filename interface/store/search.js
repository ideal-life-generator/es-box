import { fetchPlaylistSongs } from 'store/search-results'

export const SEARCH_INPUT = 'SEARCH_INPUT'

export default {
  state: {
    input: '',
    normalized: ''
  },
  getters: {
    input: state => state.input,
    normalized: state => state.normalized
  },
  mutations: {
    change: (state, input) => {
      state.input = input
      state.normalized = input.trim().toLowerCase()
    }
  },
  actions: {
    [SEARCH_INPUT]: ({ dispatch, commit }, input) => {
      commit('change', input)

      dispatch(fetchPlaylistSongs.ACTION_TYPE)
    }
  }
}
