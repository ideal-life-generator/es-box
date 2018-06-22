import Vue from 'vue'
import Router from 'vue-router'
import App from './containers/App.vue'
import Playlist from './containers/Playlist.vue'
import GoogleOAuth from './containers/GoogleOAuth.vue'
import NotFound from './containers/NotFound.vue'

Vue.use(Router)

export default () =>
  new Router({
    mode: 'history',
    routes: [
      { path: '/', component: App },
      { path: '/playlists/:key', component: Playlist },
      { path: '/google-oauth', component: GoogleOAuth },
      { path: '*', component: NotFound }
    ]
  })
