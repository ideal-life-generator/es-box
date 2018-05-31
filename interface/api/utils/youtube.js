import { create } from 'axios'
import { YOUTUBE_API_URL, YOUTUBE_API_KEY } from '../../../config'

const axios = create({
  baseURL: YOUTUBE_API_URL,
  params: {
    key: YOUTUBE_API_KEY
  }
})

axios.defaults.withCredentials = true

export default axios
