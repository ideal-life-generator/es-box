import fetch from './utils/fetch'

const normalizeIds = ({ items }) => items.map(({ id: { videoId: id } }) => id).join(',')

const normalize = ({ pageInfo: { totalResults }, items, items: { length: count } }) => ({
  count,
  items: items.map(({
    id,
    snippet: {
      title,
      thumbnails: { medium: { url: thumbnailUrl } },
    },
  }) => ({
    id,
    title,
    thumbnailUrl,
  })),
  total: totalResults,
})

export const search = async ({ key, count }) => {
  const { data: ids } = await fetch('search', {
    query: {
      q: key,
      maxResults: count,
      type: 'video',
      part: 'id',
    },
  })

  const normalizedIds = normalizeIds(ids)

  const { data } = await fetch('videos', {
    query: {
      id: normalizedIds,
      part: 'snippet,contentDetails',
    },
  })

  const normalizedData = normalize(data)

  return {
    data: normalizedData,
  }
}
