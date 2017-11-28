import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import createRouter from './router'
import createStore from './store'
import apolloProvider from './apollo-provider'
import App from './containers/App.vue'

export default () => {
  const router = createRouter()

  const store = createStore()

  sync(store, router)

  const app = new Vue({
    router,
    store,
    apolloProvider,
    render: h => h(App),
  })

  return { app, router, store }
}

if (!PRODUCTION) { // eslint-disable-line no-undef
  Vue.config.productionTip = false
}
