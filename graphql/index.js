import { makeExecutableSchema } from 'graphql-tools'
import _normalizeKey from '__/normalize-key'
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

type Query {
  youtube: Youtube
}

type Schema {
  query: Query
}
`

const resolvers = {
  Query: {
    youtube: () => ({}),
  },
  Youtube: {
    songs: async (youtube, params) => {
      // try {
      //   const { data } = await search({ key: null, count: 5 })

      //   return data
      // } catch (error) {

      // }
    },
  },
}

export default makeExecutableSchema({
  typeDefs,
  resolvers,
})
