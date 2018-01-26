import $createFetchGraphQL from 'core/fetch-graphql' // eslint-disable-line
import { SERVER_BASE_URL } from '../../config'

export default $createFetchGraphQL('graphql', {
  baseUrl: SERVER_BASE_URL,
})
