import gql from 'graphql-tag'

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
]
