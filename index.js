import Koa from 'koa'
import serve from 'koa-static'
import { blue } from 'chalk'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'
import { StaticRouter } from 'react-router-dom'
import { serverPort } from './config'
import createStore from './client/store'
import Routes from './client/Routes'
import indexHTML from './client/index.html'

const app = new Koa()

app.use(serve('static'))

app.use(PRODUCTION ? (ctx) => { // eslint-disable-line no-undef
  const context = {}

  const store = createStore()

  const markup = renderToString((
    <Provider store={store}>
      <StaticRouter
        location={ctx.request.url}
        context={context}
      >
        <Routes />
      </StaticRouter>
    </Provider>
  ))

  if (context.url) {
    ctx.status = 301
    ctx.redirect(context.url)
  } else {
    const state = store.getState()

    ctx.body = indexHTML.replace('<div id="app"></div>', `
      <script>window.PRELOADED_STATE = ${JSON.stringify(state).replace(/</g, '\\u003c')}</script>
      <div id="app">${markup}</div>
    `)
  }
} : (ctx) => {
  ctx.body = 'Koa server'
})

app.listen(serverPort, () => console.info(blue(`Server is listening on ${serverPort} port`)))
