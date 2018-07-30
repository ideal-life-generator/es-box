import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import infiniteScroll from 'vue-infinite-scroll'
import VueDragDrop from 'vue-drag-drop'
import createRouter from 'router'
import createStore from 'store'
import apolloProvider from 'apollo'
import App from './App.vue'

export const router = createRouter()
export const store = createStore()

sync(store, router)

const app = new Vue({
  router,
  store,
  provide: apolloProvider.provide(),
  render: h => h(App)
})

Vue.use(infiniteScroll)
Vue.use(VueDragDrop)

app.$mount('#app')

if (!PRODUCTION) {
  // eslint-disable-line no-undef
  Vue.config.productionTip = false
}
