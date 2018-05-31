import { create } from 'axios'
import { GRAPHQL_API_URL } from '../../../config'

const graphql = create({
  baseURL: GRAPHQL_API_URL
})

export default query => graphql({
  method: 'post',
  data: { query }
})
