import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import serve from 'koa-static'
import cors from 'koa-cors'
import { graphqlKoa, graphiqlKoa } from 'apollo-server-koa'
import { blue } from 'chalk'
import ytdl from 'ytdl-core'
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

// const getMp3 = id => new Promise((resolve, reject) => {
//   const youtubeDl = spawn(resolvePath('youtube-dl.exe'), [
//     '--extract-audio',
//     '--audio-format=mp3',
//     id,
//   ])

//   let result = ''

//   youtubeDl.stdout.on('data', data => {
//     result += data.toString()
//   })

//   youtubeDl.on('close', () => {
//     resolve(result)
//   })
// })

router.get('/youtube/mp3/:id', async (context) => {
  const { params: { id } } = context

  // const mp3 = await getMp3(id)

  // console.log(mp3)

  context.response.body = ytdl(id)
})

router.get('*', (ctx) => {
  ctx.body = 'Koa server'
})

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(SERVER_PORT, () =>
  console.info(blue(`Server is listening on ${SERVER_PORT} port`))
)
