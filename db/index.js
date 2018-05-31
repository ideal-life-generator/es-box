import { Database, aql } from 'arangojs'

const db = new Database()

const upsertUser = async ({ email }) => {
  const cursor = await db.query(aql`
    UPSERT { email: ${email} }
    INSERT {
      email: ${email},
      dateCreated: DATE_NOW(),
      dateUpdated: DATE_NOW()
    }
    UPDATE {
      dateUpdated: DATE_NOW()
    }
    IN users
    RETURN NEW
  `)

  return await cursor.next()
}

export default { upsertUser }
