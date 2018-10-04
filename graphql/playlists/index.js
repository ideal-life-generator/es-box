import db from '../../db'

const typesQL = `
type Playlist {
  _id: ID!
  _key: ID!
  name: String!
  ids: [ID]
  total: Int!
}

type PlaylistsPagination {
  items: [Playlist]!
  total: Int!
}

type Song {
  _id: ID!
  youtubeVideoId: ID!
}

type InPlaylistAs {
  _id: ID!
  index: Int!
}

type PlaylistSong {
  song: Song!
  inPlaylistAs: InPlaylistAs!
}

type PlaylistSongsPagination {
  items: [PlaylistSong]!
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
  playlistId: ID!
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

addPlaylistSong(
  playlistId: ID!
  youtubeVideoId: ID!
  index: Int
) : PlaylistSong

movePlaylistSong(
  playlistId: ID!
  inPlaylistAsId: ID!
  currentIndex: Int!
  nextIndex: Int!
) : PlaylistSongsPagination

removePlaylistSong(
  playlistId: ID!
  itemId: ID!
) : PlaylistSongsPagination
`

const queries = {
  playlists: async (parent, { offset, limit }) => {
    try {
      return await db.getPlaylists({ offset, limit })
    } catch (error) {
      throw error
    }
  },
  playlist: async (parent, { _key }) => {
    try {
      return await db.getPlaylist(_key)
    } catch (error) {
      throw error
    }
  },
  playlistSongs: async (parent, { playlistId, offset, limit }) => {
    try {
      return await db.getPlaylistSongs(playlistId, { offset, limit })
    } catch (error) {
      throw error
    }
  }
}

const mutations = {
  createPlaylist: async (parent, data) => {
    try {
      return await db.insertPlaylist(data)
    } catch (error) {
      throw error
    }
  },
  deletePlaylist: async (parent, data) => {
    try {
      return await db.removePlaylist(data)
    } catch (error) {
      throw error
    }
  },
  addPlaylistSong: async (parent, { playlistId, youtubeVideoId, index }) => {
    try {
      return await db.addPlaylistSong({ playlistId, youtubeVideoId, index })
    } catch (error) {
      throw error
    }
  },
  movePlaylistSong: async (parent, params) => {
    try {
      return await db.movePlaylistItem(params)
    } catch (error) {
      throw error
    }
  },
  removePlaylistSong: async (parent, { playlistId, itemId }) => {
    try {
      return await db.removePlaylistItem(playlistId, itemId)
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
