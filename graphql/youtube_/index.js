import { makeExecutableSchema } from 'graphql-tools'
import _normalizeKey from '_/normalize-key'

const typeDefs = `
type YoutubeResult {
  id: ID!
  title: String!
  thumbnailUrl: String!
}

type YoutubeResultsPagination {
  items: [YoutubeResult]
  count: Int!
  total: Int!
}

type YoutubeResults {
  name: String
  songs(
    key: String
    cursor: Int
    count: Int
  ): YoutubeResultsPagination
}

type Query {
  youtubeResults: YoutubeResults,
}

type Query {
  user: User
}

type Schema {
  query: Query
}
`

const resolvers = {
  Query: {
    user: () => ({ name: 'Vlad' }),
  },
  User: {
    songs: (user, params) => {
      let items

      if (params.key) {
        items = params.key ? userSongsMock.filter(userSong => userSong.key.includes(params.key)) : userSongsMock
      } else {
        items = userSongsMock
      }

      if (params.cursor && params.count) {
        items = items.slice(params.cursor, params.cursor + params.count)
      } else if (params.cursor) {
        items = items.slice(params.cursor)
      } else if (params.count) {
        items = items.slice(0, params.count)
      }

      const { length: count } = items
      const { length: total } = userSongsMock

      return { items, count, total }
    },
  },
}

export default makeExecutableSchema({
  typeDefs,
  resolvers,
})
