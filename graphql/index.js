import { makeExecutableSchema } from 'graphql-tools'
import google from './api/google'
import db from '../db'
import playlists from './playlists'
// import _normalizeKey from '__/normalize-key'
// import fetch from './youtube/utils/fetch'
// import { search } from './youtube'

const typeDefs = `
${playlists.typesQL}

type User {
  _id: ID!
  email: String!
}

type Query {
  user: User
  ${playlists.queriesQL}
}

type Token {
  token: String!
  refreshToken: String!
}

type Mutation {
  auth(code: String!): Token
  ${playlists.mutationsQL}
}

type Schema {
  query: Query
  mutation: Mutation
}
`

const resolvers = {
  Query: {
    user: (none, args, { session }) => session.user,
    ...playlists.queries
  },
  Mutation: {
    auth: async (googleOAuth, { code }, { session }) => {
      try {
        const { token, refreshToken } = await google.createToken(code)
        google.setToken(token)

        const googleAccount = await google.getAccount()

        const user = await db.upsertUser(googleAccount)

        session.user = user

        return { token, refreshToken }
      } catch (error) {
        throw error
      }
    },
    ...playlists.mutations
  }
}

export default makeExecutableSchema({
  typeDefs,
  resolvers,
})
