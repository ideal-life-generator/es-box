import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import searchResults from './search-results'

Vue.use(Vuex)

export default () =>
  new Store({
    modules: {
      searchResults
    }
  })
