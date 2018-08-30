import Vue from 'vue'
import Router from 'vue-router'
import Main from './containers/Main.vue'
import Playlist from './containers/Playlist.vue'
import GoogleOAuth from './containers/GoogleOAuth.vue'
import NotFound from './containers/NotFound.vue'

Vue.use(Router)

export default () =>
  new Router({
    mode: 'history',
    routes: [
      {
        path: '/',
        component: Main,
        children: [{
          path: '/playlist/:_key',
          component: Playlist
        }]
      },
      { path: '/google-oauth', component: GoogleOAuth },
      { path: '*', component: NotFound }
    ],
    linkActiveClass: 'active',
    linkExactActiveClass: 'active'
  })
