import $fetchGraphQL from './utils/fetch-graphql'

export const USER_SONGS = (key) => `{
  user {
    songs(key: "${key}") {
      total
      items {
        id
        title
        key
      }
    }
  }
}`

const parseUserSongs = ({ user: { songs: { total, items } } }) => ({ total, items })

export default async key => {
  const query = USER_SONGS(key)
  const { data } = await $fetchGraphQL(query)

  return parseUserSongs(data)
}
