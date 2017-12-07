import gql from 'graphql-tag'

export const USER_DEFINED = gql`{
  songs {
    user {
      total
      items {
        title
      }
    }
  }
}`
