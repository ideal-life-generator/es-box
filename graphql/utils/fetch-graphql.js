import $createFetchGraphQL from 'core/fetch-graphql' // eslint-disable-line
import { GRAPHQL_API_URL } from '../../config'

export default $createFetchGraphQL({
  baseURL: GRAPHQL_API_URL,
})
