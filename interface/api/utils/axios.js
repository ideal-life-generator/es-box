import { create } from 'axios'
import { YOUTUBE_API_URL, YOUTUBE_API_KEY } from '../../../config'

export default create({
  baseURL: YOUTUBE_API_URL,
  params: {
    key: YOUTUBE_API_KEY
  },
})
