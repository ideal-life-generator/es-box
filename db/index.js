import { Database, aql } from 'arangojs'

const db = new Database()

const upsertUser = async ({ email }) => {
  const cursor = await db.query(aql`
    UPSERT { email: ${email} }
    INSERT {
      email: ${email},
      createdAt: DATE_NOW(),
      updatedAt: DATE_NOW()
    }
    UPDATE {
      updatedAt: DATE_NOW()
    }
    IN users
    RETURN NEW
  `)

  return await cursor.next()
}

const insertPlaylist = async data => {
  const cursor = await db.query(aql`
    INSERT {
      name: ${data.name},
      ids: ${data.ids},
      createdAt: DATE_NOW(),
      updatedAt: DATE_NOW()
    }
    IN playlists
    RETURN NEW
  `)

  return await cursor.next()
}

const removePlaylist = async _key => {
  const cursor = await db.query(aql`
    REMOVE ${_key}
    IN playlists
    RETURN OLD
  `)

  return await cursor.next()
}

const getPlaylists = async ({ offset, limit }) => {
  const itemsCursor = await db.query(aql`
    FOR playlist IN playlists
    SORT playlist.createdAt DESC
    LIMIT ${offset}, ${limit}
    RETURN playlist
  `)

  const totalCursor = await db.query(aql`
    RETURN LENGTH(playlists)
  `)

  const items = await itemsCursor.all()
  const total = await totalCursor.next()

  return {
    items,
    total
  }
}

const getPlaylistSongs = async key => {
  const id = `playlists/${key}`

  const cursor = await db.query(aql`
    FOR song IN ANY ${id} used_in_playlist
    RETURN song
  `)

  return await cursor.all()
}

const addPlaylistItem = async (_key, sourceId, index = 0) => {
  const id = `playlists/${_key}`

  const cursor = await db.query(aql`
    LET playlist = DOCUMENT(${id})
    LET nextIds = UNION(
      SLICE(playlist.ids, 0, ${index}),
      [${sourceId}],
      SLICE(playlist.ids, ${index})
    )
    UPDATE playlist WITH {
      ids: nextIds
    } IN playlists
    RETURN NEW
  `)

  const playlist = await cursor.next()

  return {
    ...playlist,
    total: playlist.ids.length
  }
}

const movePlaylistItem = async (_key, currentIndex, nextIndex) => {
  const id = `playlists/${_key}`

  const cursor = await db.query(aql`
    LET playlist = DOCUMENT(${id})
    LET sourceId = NTH(playlist.ids, ${currentIndex})
    LET idsWithRemovedItem = REMOVE_NTH(playlist.ids, ${currentIndex})
    LET nextIds = UNION(
      SLICE(idsWithRemovedItem, 0, ${nextIndex}),
      [sourceId],
      SLICE(idsWithRemovedItem, ${nextIndex})
    )
    UPDATE playlist WITH {
      ids: nextIds
    } IN playlists
    RETURN NEW
  `)

  const playlist = await cursor.next()

  return {
    ...playlist,
    total: playlist.ids.length
  }
}

const removePlaylistItem = async (_key, index) => {
  const id = `playlists/${_key}`

  const cursor = await db.query(aql`
    LET playlist = DOCUMENT(${id})
    UPDATE playlist WITH {
      ids: REMOVE_NTH(playlist.ids, ${index})
    } IN playlists
    RETURN NEW
  `)

  const playlist = await cursor.next()

  return {
    ...playlist,
    total: playlist.ids.length
  }
}

export default {
  upsertUser,
  getPlaylists,
  getPlaylistSongs,
  insertPlaylist,
  removePlaylist,
  addPlaylistItem,
  movePlaylistItem,
  removePlaylistItem
}
