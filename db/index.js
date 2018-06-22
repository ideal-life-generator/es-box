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

const getPlaylists = async ({ offset, limit }) => {
  const cursor = await db.query(aql`
    FOR playlist IN playlists
    SORT playlist.createdAt DESC
    RETURN playlist
  `)

  return await cursor.all()
}

const getPlaylist = async key => {
  const id = `playlists/${key}`

  const cursor = await db.query(aql`
    RETURN DOCUMENT(${id})
  `)

  return await cursor.next()
}

export default {
  upsertUser,
  getPlaylists,
  getPlaylist,
  insertPlaylist
}
