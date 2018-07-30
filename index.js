import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
// import fallback from 'express-history-api-fallback'
import session from 'express-session'
import connectRedis from 'connect-redis'
import graphql from 'express-graphql'
import { blue } from 'chalk'
import schema from './graphql'
import { SERVER_PORT } from './config'

const app = express()

const RedisSession = connectRedis(session)

app.use(cookieParser())
app.use(bodyParser.json())
app.use(session({
  store: new RedisSession(),
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}))

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))

app.use(express.static('./'))

app.use('/graphql', graphql(req => ({
  schema,
  context: { session: req.session },
  graphiql: true
})))

app.use('*', (req, res) => {
  res.end('Koa server')
})

app.listen(SERVER_PORT, () => {
  console.info(blue(`Server is listening on ${SERVER_PORT} port`))
})
