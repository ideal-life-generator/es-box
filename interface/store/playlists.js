import { playlistSongs } from 'api'

export default {
  state: {
    newPlaylist: null,
    playlists: []
  },
  mutations: {
    createPlaylist: state => {
      state.newPlaylist = {
        name: 'New',
        normalizedName: 'New',
        items: []
      }
    },
    addItem: (state, item) => {
      state.newPlaylist.items.push(item)
    },
    changeNewPlaylistName: (state, name) => {
      state.name = name
      state.normalizedName = name.trim()
    },
    updateName: (state, name) => {
      state.newPlaylist.name = name
    }
  },
  actions: {
    addItem: ({ state, commit }, item) => {
      if (!state.newPlaylist) {
        commit('createPlaylist')
      }

      commit('addItem', item)
    },
  }
}
