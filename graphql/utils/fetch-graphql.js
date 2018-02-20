import $createFetchGraphQL from 'core/fetch-graphql'
import { GRAPHQL_API_URL } from '../../config'

export default $createFetchGraphQL({
  baseURL: GRAPHQL_API_URL,
})
