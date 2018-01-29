import { makeExecutableSchema } from 'graphql-tools'
import { $key } from 'core/normalize' // eslint-disable-line

export const userSongsMock = [{
  id: 0,
  title: 'Evol Intent - Middle of the night',
}, {
  id: 1,
  title: 'Bungle - You',
}, {
  id: 2,
  title: 'Makoto - Wue',
}, {
  id: 3,
  title: 'BCee - Think Twice',
}, {
  id: 4,
  title: 'Bungle - Back To Mars',
}, {
  id: 5,
  title: 'Wiz Khalifa - Got Me Some More',
}, {
  id: 6,
  title: 'One Punch Man - BATTLE!! (Extended)',
}, {
  id: 7,
  title: 'The Weeknd - Starboy (official) ft. Daft Punk',
}].map(data => Object.assign(data, { key: $key(data.title) }))

const typeDefs = `
type Song {
  id: ID!
  title: String!
  key: String!
}

type SongsPagination {
  items: [Song]
  count: Int!
  total: Int!
}

type User {
  name: String
  songs(
    key: String
    cursor: Int
    count: Int
  ): SongsPagination
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
