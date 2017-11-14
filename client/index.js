import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import { sync } from 'vuex-router-sync'
import routes from './routes'
import createStore from './store'

Vue.use(VueRouter)
Vue.use(Vuex)

const router = new VueRouter({
  mode: 'history',
  routes,
})

const store = createStore()

sync(store, router)

const app = new Vue({
  router,
  store,
  template: '<router-view />',
})

app.$mount('#app')

if (!PRODUCTION) { // eslint-disable-line no-undef
  Vue.config.productionTip = false
}
