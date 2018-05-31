import { makeExecutableSchema } from 'graphql-tools'
import google from './api/google'
import db from '../db'
// import _normalizeKey from '__/normalize-key'
// import fetch from './youtube/utils/fetch'
// import { search } from './youtube'

const typeDefs = `
type Song {
  id: ID!
  title: String!
  thumbnail: String!
}

type SongsPagination {
  items: [Song]
  count: Int!
  total: Int!
}

type Youtube {
  songs(
    key: String
    cursor: Int
    count: Int
  ): SongsPagination
}

type User {
  _id: ID!
  email: String!
}

type Query {
  youtube: Youtube
  user: User
}

type Token {
  token: String!
  refreshToken: String!
}

type Mutation {
  auth(code: String!): Token
}

type Schema {
  query: Query
  mutation: Mutation
}
`

const resolvers = {
  Query: {
    youtube: () => ({ songs: { count: 1 } }),
    user: (none, args, { session }) => session.user
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
  },
  Youtube: {
    songs: async (youtube, params) => {
      // try {
      //   const { data } = await search({ key: null, count: 5 })

      //   return data
      // } catch (error) {

      // }
    },
  }
}

export default makeExecutableSchema({
  typeDefs,
  resolvers,
})
