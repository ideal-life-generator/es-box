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

deletePlaylist(
  _key: ID!
) : Playlist

addPlaylistItem(
  _key: ID!
  sourceId: ID!
  index: Int!
) : Playlist

movePlaylistItem(
  _key: ID!
  currentIndex: Int!
  nextIndex: Int!
) : Playlist

removePlaylistItem(
  _key: ID!
  index: Int!
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
  },
  deletePlaylist: async (noth, data, { session }) => {
    try {
      return await db.removePlaylist(data)
    } catch (error) {
      throw error
    }
  },
  addPlaylistItem: async (noth, { _key, sourceId, index }, { session }) => {
    try {
      return await db.addPlaylistItem(_key, sourceId, index)
    } catch (error) {
      throw error
    }
  },
  movePlaylistItem: async (noth, { _key, currentIndex, nextIndex }, { session }) => {
    try {
      return await db.movePlaylistItem(_key, currentIndex, nextIndex)
    } catch (error) {
      throw error
    }
  },
  removePlaylistItem: async (noth, { _key, index }, { session }) => {
    try {
      return await db.removePlaylistItem(_key, index)
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
