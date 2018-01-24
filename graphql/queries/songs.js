import gql from 'graphql-tag'
import { $key } from 'core/normalize' // eslint-disable-line

export const USER_SONGS = gql`{
  songs {
    user {
      total
      items {
        title
      }
    }
  }
}`

export const userSongsMock = [
  {
    id: 0,
    title: 'Evol Intent - Middle of the night',
  },
  {
    id: 1,
    title: 'Bungle - You',
  },
  {
    id: 2,
    title: 'Makoto - Wue',
  },
].map(data => Object.assign(data, { key: $key(data.title) }))
