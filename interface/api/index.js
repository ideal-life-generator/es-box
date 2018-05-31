import moment from 'moment'
import youtube from './utils/youtube'
import graphql from './utils/graphql'
import googleOAuth from './google-oauth'

const normalizeIds = ({ items }) =>
  items.map(({ id: { videoId: id } }) => id).join(',')

const normalize = ({
  pageInfo: { totalResults },
  items,
  items: { length: count }
}) => ({
  count,
  items: items.map(({
    id,
    snippet: { title, thumbnails: { medium: { url: thumbnail } } },
    contentDetails: { duration: pureDuration }
  }) => ({
    id,
    title,
    thumbnail,
    source: `http://localhost:3001/youtube/mp3/${id}`,
    duration: moment.duration(pureDuration).asSeconds()
  })),
  total: totalResults
})

const search = async (params = {}) => {
  const { key, count } = params

  const { data: ids } = await youtube('search', {
    params: {
      q: key,
      maxResults: count,
      type: 'video',
      part: 'id'
    }
  })

  const normalizedIds = normalizeIds(ids)

  const { data } = await youtube('videos', {
    params: {
      id: normalizedIds,
      part: 'snippet,contentDetails'
    }
  })

  const normalizedData = normalize(data)

  return normalizedData
}

const token = async code => {
  const { data } = await graphql(`
    query {
      token(code: "${code}") {
        token,
        refreshToken
      }
    }
  `)

  return data
}

export default { search, token, googleOAuth }
