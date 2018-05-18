import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import size from './size'
import search from './search'
import searchResults from './search-results'

Vue.use(Vuex)

export default () => new Store({
  modules: {
    size,
    search,
    searchResults
  },
  plugins: [createPersistedState()]
})
