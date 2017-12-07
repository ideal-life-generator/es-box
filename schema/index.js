import { makeExecutableSchema } from 'graphql-tools'

const userSongs = [
  {
    artist: 'Evol Intent',
    title: 'Middle of the night',
  },
  {
    artist: 'Bungle',
    title: 'You',
  },
  {
    artist: 'Makoto',
    title: 'Wue',
  },
]

const typeDefs = `
type Song {
  artist: String
  title: String
}

type UserPagination {
  total: Int!
  items: [Song]
}

type Songs {
  user: UserPagination
}

type Query {
  songs: Songs
}

type schema {
  query: Query
}
`

const resolvers = {
  Query: {
    songs: () => ({}),
  },
  Songs: {
    user: () => ({
      total: userSongs.length,
      items: userSongs,
    }),
  },
}

export default makeExecutableSchema({
  typeDefs,
  resolvers,
})
