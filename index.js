import { readFileSync } from 'fs'
import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import serve from 'koa-static'
import cors from 'koa-cors'
import { graphqlKoa, graphiqlKoa } from 'apollo-server-koa'
import { createBundleRenderer } from 'vue-server-renderer'
import { blue } from 'chalk'
import schema from './schema'
import { serverPort } from './config'

const app = new Koa()

const router = new Router()

app.use(bodyParser())
app.use(serve('./'))
app.use(cors())

router.post('/graphql', graphqlKoa({ schema }))
router.get('/graphql', graphqlKoa({ schema }))

router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }))

router.get('*', PRODUCTION ? (() => { // eslint-disable-line no-undef
  const { parse } = JSON
  const template = readFileSync('./index.template.html', 'utf8')
  const serverBundle = parse(readFileSync('./vue-ssr-server-bundle.json', 'utf8'))
  const clientManifest = parse(readFileSync('./vue-ssr-client-manifest.json', 'utf8'))

  const renderer = createBundleRenderer(serverBundle, {
    template,
    clientManifest,
  })

  return async ctx => {
    try {
      const context = {
        url: ctx.request.url,
        title: 'Vue app',
      }

      const markup = await renderer.renderToString(context)

      ctx.body = markup
    } catch (error) {
      if (error.status === 404) {
        ctx.status = 404
        ctx.body = 'Page not found'
      } else {
        throw error
      }
    }
  }
})() : ctx => {
  ctx.body = 'Koa server'
})

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(serverPort, () => console.info(blue(`Server is listening on ${serverPort} port`)))
