import Koa from 'koa'
import serve from 'koa-static'
import { blue } from 'chalk'
import { serverPort } from './config'

const app = new Koa()

app.use(serve('static'))

app.use((ctx) => {
  ctx.body = 'Koa server'
})

app.listen(serverPort, () => console.info(blue(`Server is listening on ${serverPort} port`)))
