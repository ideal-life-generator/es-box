export const PLAYLISTS_MENU_CHECK_CURRENT_PLAYLIST_SETTINGS_MUTATION = 'PLAYLISTS_MENU@CCHECK_CURRENT_PLAYLIST_SETTINGS_MUTATION'
export const PLAYLISTS_MENU_SET_CURRENT_PLAYLIST_ID_MUTATION = 'PLAYLISTS_MENU@SET_CURRENT_PLAYLIST_ID_MUTATION'
export const PLAYLISTS_MENU_SET_CURRENT_PLAYLIST_ITEM_MUTATION = 'PLAYLISTS_MENU@SET_CURRENT_PLAYLIST_ITEM_INDEX_MUTATION'
export const PLAYLISTS_MENU_SET_CURRENT_ACTION = 'PLAYLISTS_MENU@SET_PLAYLIST_CURRENT_INDEX_MUTATION'

export default {
  state: {
    showItems: [],
    playlistsSettings: {},
    currentPlaylistId: null,
    currentItemId: null,
    currentItemIndex: null
  },
  getters: {
    playlistsMenu: state => state,
    currentPlaylistId: state => state.currentPlaylistId,
    currentPlaylistSettings: state => state.playlistsSettings[state.currentPlaylistId],
    currentItemId: state => state.currentItemId,
    currentItemIndex: state => state.currentItemIndex
  },
  mutations: {
    [PLAYLISTS_MENU_CHECK_CURRENT_PLAYLIST_SETTINGS_MUTATION]: (state, playlistId) => {
      if (!state.playlistsSettings[playlistId]) {
        state.playlistsSettings[playlistId] = {}
      }
    },
    [PLAYLISTS_MENU_SET_CURRENT_PLAYLIST_ID_MUTATION]: (state, playlistId) => {
      state.currentPlaylistId = playlistId
    },
    [PLAYLISTS_MENU_SET_CURRENT_PLAYLIST_ITEM_MUTATION]: (state, {
      currentPlaylistId,
      currentItemId,
      currentItemIndex
    }) => {
      Object.assign(state, {
        currentPlaylistId,
        currentItemId,
        currentItemIndex
      })
    },
    onShowItems(state, i) {
      state.showItems.splice(i, 1, true)
    },
    onHideItems(state, i) {
      state.showItems.splice(i, 1, false)
    }
  },
  actions: {
    [PLAYLISTS_MENU_SET_CURRENT_ACTION]: ({ state, commit }, {
      currentPlaylistId,
      currentItemId,
      currentItemIndex
    }) => {
      commit(PLAYLISTS_MENU_CHECK_CURRENT_PLAYLIST_SETTINGS_MUTATION, state.currentPlaylistId)
      commit(PLAYLISTS_MENU_SET_CURRENT_PLAYLIST_ITEM_MUTATION, {
        currentPlaylistId,
        currentItemId,
        currentItemIndex
      })
    }
  }
}
