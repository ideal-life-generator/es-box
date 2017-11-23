import createApp from './app'

export default context => new Promise((res, rej) => {
  const { app, router, store } = createApp()

  router.push(context.url)

  router.onReady(async () => {
    try {
      const matchedComponents = router.getMatchedComponents()

      if (matchedComponents.length) {
        await Promise.all(matchedComponents.map(Component => Component.asyncData && Component.asyncData({
          store,
          route: router.currentRoute,
        })))

        context.state = store.state

        res(app)
      } else {
        throw { code: 404 }
      }
    } catch (error) {
      console.error(error)

      rej(error)
    }
  }, rej) // FIXME: Is possible to use await here?
})
