import App from './containers/App.vue'
import NotFound from './containers/NotFound.vue'

export default [
  { path: '/', component: App },
  { path: '*', component: NotFound },
]
