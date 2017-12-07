import { create } from 'axios'
import { YOUTUBE_API_KEY } from '../../../../config'

export default create({
  baseURL: 'https://content.googleapis.com/youtube/v3',
  params: {
    key: YOUTUBE_API_KEY,
  },
})
