import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const asyncComponent = (url) => () => import(url)

export default () =>
  new Router({
    mode: 'history',
    routes: [
      { path: '/', component: asyncComponent('./containers/App.vue') },
      { path: '*', component: asyncComponent('./containers/NotFound.vue') }
    ]
  })
