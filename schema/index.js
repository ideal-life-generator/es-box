import { makeExecutableSchema } from 'graphql-tools'

const userDefined = [
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

type UserDefinedPagination {
  count: Int!
  collection: [Song]
}

type Songs {
  userDefined: UserDefinedPagination
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
    userDefined: () => ({
      count: userDefined.length,
      collection: userDefined,
    }),
  },
}

export default makeExecutableSchema({
  typeDefs,
  resolvers,
})
