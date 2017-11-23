import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import search from './search'

Vue.use(Vuex)

export default () => new Store({
  modules: {
    search,
  },
})
