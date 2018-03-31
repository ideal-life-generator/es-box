import moment from 'moment'
import fetch from './utils/fetch'

const normalizeIds = ({ items }) =>
  items.map(({ id: { videoId: id } }) => id).join(',')

const normalize = ({
  pageInfo: { totalResults },
  items,
  items: { length: count }
}) => ({
  count,
  items: items.map(
    ({
      id,
      snippet: { title, thumbnails: { medium: { url: thumbnailUrl } } },
      contentDetails: { duration: pureDuration }
    }) => ({
      id,
      title,
      thumbnailUrl,
      duration: moment.duration(pureDuration).asSeconds()
    })
  ),
  total: totalResults
})

export const search = async ({ key, count }) => {
  const { data: ids } = await fetch('search', {
    query: {
      q: key,
      maxResults: count,
      type: 'video',
      part: 'id'
    }
  })

  const normalizedIds = normalizeIds(ids)

  const { data } = await fetch('videos', {
    query: {
      id: normalizedIds,
      part: 'snippet,contentDetails'
    }
  })

  const normalizedData = normalize(data)

  return {
    data: normalizedData
  }
}
