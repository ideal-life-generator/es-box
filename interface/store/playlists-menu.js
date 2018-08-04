export default {
  state: {
    showItems: []
  },
  getters: {
    playlistsMenu: state => state
  },
  mutations: {
    onShowItems(state, i) {
      state.showItems.splice(i, 1, true)
    },
    onHideItems(state, i) {
      state.showItems.splice(i, 1, false)
    }
  }
}
