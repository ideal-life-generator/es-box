import $fetchGraphQL from './utils/fetch-graphql'

export const USER_SONGS = (key, cursor, count) => `{
  user {
    songs(key: "${key}", cursor: ${cursor}, count: ${count}) {
      count
      items {
        id
        title
        key
      }
      total
    }
  }
}`

const normalize = ({ user: { songs: { count, items, total } } }) => ({ count, total, items })

export default async (...args) => {
  const query = USER_SONGS(...args)
  const { data } = await $fetchGraphQL(query)

  return normalize(data)
}
