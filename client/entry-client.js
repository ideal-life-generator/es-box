import Vue from 'vue'
import createApp from './app'

const { app, router, store } = createApp()

const { __INITIAL_STATE__ } = window

if (__INITIAL_STATE__) {
  store.replaceState(__INITIAL_STATE__)
}

router.onReady(() => {
  router.beforeResolve(async (to, from, next) => {
    try {
      const matched = router.getMatchedComponents(to)
      const prevMatched = router.getMatchedComponents(from)

      let diffed = false
      const activated = matched.filter((c, i) => diffed || (diffed = (prevMatched[i] !== c)))

      if (activated.length) {
        await Promise.all(activated.map(c => c.asyncData && c.asyncData({ store, route: to })))
      }
    } catch (error) {
      console.error(error)
    } finally {
      next()
    }
  })

  app.$mount('#app')
})

Vue.mixin({
  async beforeRouteUpdate(to, from, next) {
    try {
      const { asyncData } = this.$options

      if (asyncData) {
        await asyncData({
          store: this.$store,
          route: to,
        })
      }
    } catch (error) {
      console.error(error)
    } finally {
      next()
    }
  },
})
