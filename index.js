import { readFileSync } from 'fs'
import Koa from 'koa'
import serve from 'koa-static'
import { createBundleRenderer } from 'vue-server-renderer'
import { blue } from 'chalk'
import { serverPort } from './config'

const app = new Koa()

app.use(serve('./'))

app.use(PRODUCTION ? (() => { // eslint-disable-line no-undef
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

app.listen(serverPort, () => console.info(blue(`Server is listening on ${serverPort} port`)))
