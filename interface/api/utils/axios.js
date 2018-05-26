import { create } from 'axios'
import { YOUTUBE_API_URL } from '../../../config'

export default create({
  baseURL: YOUTUBE_API_URL,
})
