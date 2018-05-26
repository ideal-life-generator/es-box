// import createAction from 'utils/create-action'

// export const CHANGE_NAME = 'CHANGE_NAME'

export default {
  state: {
    newPlaylist: null,
    playlists: []
  },
  getters: {
    newPlaylist: state => state.newPlaylist
  },
  mutations: {
    createPlaylist: state => {
      state.newPlaylist = {
        name: 'New Playlist',
        normalizedName: 'New Playlist',
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
