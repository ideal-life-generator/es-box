import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import size from './size'
import search from './search'
import searchResults from './search-results'
import playlists from './playlists'
import googleOAuth from './google-oauth'
import error from './error'

Vue.use(Vuex)

export default () => new Store({
  modules: {
    size,
    search,
    searchResults,
    playlists,
    googleOAuth,
    error
  },
  plugins: [createPersistedState()]
})
