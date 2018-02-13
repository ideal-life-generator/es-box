import _fetch from '_/fetch' // eslint-disable-line
import { YOUTUBE_API_URL, YOUTUBE_API_KEY } from '../../../../config'

export default _fetch({
  baseURL: YOUTUBE_API_URL,
  query: {
    key: YOUTUBE_API_KEY,
  },
})
