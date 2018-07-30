import moment from 'moment'
import youtube from './utils/youtube'
import graphql from './utils/graphql'
import googleOAuth from './google-oauth'

const normalizeIds = ({
  items,
  items: { length: count },
  pageInfo: { totalResults: total },
  nextPageToken
}) => ({
  items: items.map(({ id: { videoId: id } }) => id),
  count,
  total,
  nextPageToken
})

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
    _id: id,
    sourceId: id,
    title,
    thumbnail,
    duration: moment.duration(pureDuration).asSeconds()
  })),
  total: totalResults
})

const getVideos = async (ids = []) => {
  const idsQuery = ids.join(',')

  const { data } = await youtube('videos', {
    params: {
      id: idsQuery,
      part: 'snippet,contentDetails'
    }
  })

  const normalizedData = normalize(data)

  return normalizedData
}

const search = async (params = {}) => {
  const { key, limit, pageToken } = params

  const { data } = await youtube('search', {
    params: {
      q: key,
      maxResults: limit,
      type: 'video',
      part: 'id',
      pageToken
    }
  })

  const { items: ids, count, total, nextPageToken } = normalizeIds(data)

  const { items } = await getVideos(ids)

  return {
    items,
    count,
    total,
    nextPageToken
  }
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

export default {
  search,
  token,
  getVideos,
  googleOAuth
}
