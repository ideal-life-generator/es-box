import db from '../../db'

const typesQL = `
type Playlist {
  _id: ID!
  _key: ID!
  name: String!
  ids: [ID]
}

type PlaylistsPagination {
  items: [Playlist]!
  offset: Int!
  count: Int!
  total: Int!
}
`

const queriesQL = `
playlists(
  offset: Int
  limit: Int
) : PlaylistsPagination

playlist(
  key: String!
) : Playlist
`

const mutationsQL = `
createPlaylist(
  name: String!
  ids: [ID]!
) : Playlist
`

const queries = {
  playlists: async (noth, params) => {
    try {
      const items = await db.getPlaylists(params)

      return {
        items,
        offset: 0,
        count: 5,
        total: 50
      }
    } catch (error) {
      throw error
    }
  },
  playlist: async (noth, { key }) => {
    try {
      return await db.getPlaylist(key)
    } catch (error) {
      throw error
    }
  }
}

const mutations = {
  createPlaylist: async (noth, data, { session }) => {
    try {
      return await db.insertPlaylist(data)
    } catch (error) {
      throw error
    }
  }
}

export default {
  typesQL,
  queriesQL,
  mutationsQL,
  queries,
  mutations
}
