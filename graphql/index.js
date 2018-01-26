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
  total: Int!
}

type User {
  name: String
  songs(key: String): SongsPagination
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
    songs: (user, { key }) => {
      const items = key ? userSongsMock.filter(userSong => userSong.key.includes(key)) : userSongsMock
      const { length: total } = items

      return { items, total }
    },
  },
}

export default makeExecutableSchema({
  typeDefs,
  resolvers,
})
