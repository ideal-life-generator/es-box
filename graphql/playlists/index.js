import db from '../../db'

const typesQL = `
type Playlist {
  _id: ID!
  _key: ID!
  name: String!
  ids: [ID]
  total: Int!
}

type Song {
  _id: ID!
  _key: ID!
  youtubeVideoId: ID!
}

type PlaylistsPagination {
  items: [Playlist]!
  total: Int!
}

type PlaylistSongsPagination {
  items: [Song]!
  total: Int!
}
`

const queriesQL = `
playlists(
  offset: Int
  limit: Int
) : PlaylistsPagination

playlist(
  _key: String!
) : Playlist

playlistSongs(
  _key: String!
  offset: Int
  limit: Int
) : PlaylistSongsPagination
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
  playlists: async (noth, { offset, limit }) => {
    try {
      return await db.getPlaylists({ offset, limit })
    } catch (error) {
      throw error
    }
  },
  playlist: async (noth, { _key }) => {
    try {
      return await db.getPlaylist(_key)
    } catch (error) {
      throw error
    }
  },
  playlistSongs: async (noth, { _key, offset, limit }) => {
    try {
      return await db.getPlaylistSongs(_key, { offset, limit })
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
