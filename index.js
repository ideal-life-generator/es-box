import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import serve from 'koa-static'
import cors from 'koa-cors'
import { graphqlKoa, graphiqlKoa } from 'apollo-server-koa'
import { blue } from 'chalk'
import schema from './graphql'
import { SERVER_PORT } from './config'

const app = new Koa()

const router = new Router()

app.use(bodyParser())
app.use(serve('./'))
app.use(cors())

router.post('/graphql', graphqlKoa({ schema }))
router.get('/graphql', graphqlKoa({ schema }))

router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }))

router.get('*', ctx => {
  ctx.body = 'Koa server'
})

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(SERVER_PORT, () => console.info(blue(`Server is listening on ${SERVER_PORT} port`)))
