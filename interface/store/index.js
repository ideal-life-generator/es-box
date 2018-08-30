import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import size from './size'
import search from './search'
import searchResults from './search-results'
import newPlaylist from './new-playlist'
import playlists from './playlists'
import playlistsMenu from './playlists-menu'
import googleOAuth from './google-oauth'
import player from './player'
import counter from './counter'
import youtubePlayer from './youtube-player'
import error from './error'

Vue.use(Vuex)

export default () => new Store({
  modules: {
    size,
    search,
    searchResults,
    newPlaylist,
    playlists,
    playlistsMenu,
    googleOAuth,
    player,
    counter,
    youtubePlayer,
    error
  },
  plugins: [createPersistedState()]
})
