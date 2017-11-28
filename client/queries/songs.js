import gql from 'graphql-tag'

export const USER_DEFINED = gql`{
  songs {
    userDefined {
      count,
      collection {
        artist
        title
      }
    }
  }
}`
