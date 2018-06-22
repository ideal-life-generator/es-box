export default {
  state: {
    name: '',
    items: []
  },
  getters: {
    newPlaylist: state => state
  },
  mutations: {
    addItem: (state, item) => {
      state.items.push(item)
    },
    'new-playlist@rename': (state, name) => {
      state.name = name
    },
    'new-playlist@clear': state => {
      state.name = ''
      state.items = []
    },
  },
  actions: {
    'new-playlist@add-item': ({ state, commit }, item) => {
      if (!state.newPlaylist) {
        commit('createPlaylist')
      }

      commit('addItem', item)
    },
    'new-playlist@save': ({ state, commit }) => {
      console.log(state)
    },
  }
}
