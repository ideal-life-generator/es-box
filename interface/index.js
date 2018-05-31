import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import createRouter from './router'
import createStore from './store'
import apolloProvider from './apollo'
import App from './App.vue'

const router = createRouter()
const store = createStore()

sync(store, router)

const app = new Vue({
  router,
  store,
  provide: apolloProvider.provide(),
  render: h => h(App)
})

app.$mount('#app')

if (!PRODUCTION) {
  // eslint-disable-line no-undef
  Vue.config.productionTip = false
}
