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

const getPlaylistSongs = async (playlistId, options = {}) => {
  const { offset, limit, order = 'ASC' } = options

  const itemsCursor = await db.query(aql`
    FOR song, inPlaylistAs IN ANY ${playlistId} used_in_playlist
      SORT inPlaylistAs.index ${order}
      RETURN { song, inPlaylistAs }
  `)

  const totalCursor = await db.query(aql`
    RETURN LENGTH(
      FOR song, inPlaylistAs IN ANY ${playlistId} used_in_playlist
        SORT inPlaylistAs.index ${order}
        RETURN { song, inPlaylistAs }
    )
  `)

  const items = await itemsCursor.all()
  const total = await totalCursor.next()

  return {
    items,
    total
  }
}

const addPlaylistSong = async ({ playlistId, youtubeVideoId, index = 0 }) => {
  const songCursor = await db.query(aql`
    UPSERT { youtubeVideoId: ${youtubeVideoId} }
    INSERT {
      youtubeVideoId: ${youtubeVideoId},
      createdAt: DATE_NOW(),
      updatedAt: DATE_NOW()
    }
    UPDATE {}
    IN songs
    RETURN NEW
  `)

  const song = await songCursor.next()

  const updateNextIndexesCursor = await db.query(aql`
    FOR song, inPlaylistAs IN ANY ${playlistId} used_in_playlist
      FILTER inPlaylistAs.index >= ${index}
      UPDATE inPlaylistAs WITH { index: inPlaylistAs.index + 1 } IN used_in_playlist
  `)

  await updateNextIndexesCursor.all()

  const usedInPlaylistEdgeCursor = await db.query(aql`
    INSERT {
      _from: ${song._id},
      _to: ${playlistId},
      index: ${index}
    }
    IN used_in_playlist
    RETURN NEW
  `)

  const inPlaylistAs = await usedInPlaylistEdgeCursor.next()

  return {
    song,
    inPlaylistAs,
  }
}

const removePlaylistSong = async ({ playlistId, itemId }) => {
  const inPlaylistAsKey = itemId.slice(17)

  const removedInPlaylistEdgeCursor = await db.query(aql`
    REMOVE ${inPlaylistAsKey} IN used_in_playlist
    RETURN OLD
  `)

  const removedInPlaylist = await removedInPlaylistEdgeCursor.next()

  const songCursor = await db.query(aql`
    RETURN DOCUMENT (${removedInPlaylist._from})
  `)

  const song = await songCursor.next()

  const updateNextIndexesCursor = await db.query(aql`
    FOR song, inPlaylistAs IN ANY ${playlistId} used_in_playlist
      FILTER inPlaylistAs.index >= ${removedInPlaylist.index}
      UPDATE inPlaylistAs WITH { index: inPlaylistAs.index - 1 } IN used_in_playlist
  `)

  await updateNextIndexesCursor.all()

  return {
    song,
    inPlaylistAs: removedInPlaylist,
  }
}

const movePlaylistItem = async ({ playlistId, inPlaylistAsId, currentIndex, nextIndex }) => {
  let updateNextIndexesCursor
  if (nextIndex > currentIndex) {
    updateNextIndexesCursor = await db.query(aql`
      FOR song, inPlaylistAs IN ANY ${playlistId} used_in_playlist
        FILTER inPlaylistAs.index > ${currentIndex} AND inPlaylistAs.index <= ${nextIndex}
        UPDATE inPlaylistAs WITH { index: inPlaylistAs.index - 1 } IN used_in_playlist
    `)
  } else if (nextIndex < currentIndex) {
    updateNextIndexesCursor = await db.query(aql`
      FOR song, inPlaylistAs IN ANY ${playlistId} used_in_playlist
        FILTER inPlaylistAs.index >= ${nextIndex} AND inPlaylistAs.index < ${currentIndex}
        UPDATE inPlaylistAs WITH { index: inPlaylistAs.index + 1 } IN used_in_playlist
    `)
  }

  console.log(currentIndex, nextIndex)

  await updateNextIndexesCursor.all()

  const updateCurrentIndexCursor = await db.query(aql`
    UPDATE DOCUMENT(${inPlaylistAsId})
    WITH {
      index: ${nextIndex}
    } IN used_in_playlist
    RETURN NEW
  `)

  const inPlaylistAs = await updateCurrentIndexCursor.next()

  const songCursor = await db.query(aql`
    RETURN DOCUMENT (${inPlaylistAs._from})
  `)

  const song = await songCursor.next()

  return {
    song,
    inPlaylistAs,
  }
}

export default {
  upsertUser,
  getPlaylists,
  getPlaylistSongs,
  insertPlaylist,
  removePlaylist,
  addPlaylistSong,
  movePlaylistItem,
  removePlaylistSong,
}
