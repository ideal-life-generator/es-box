import fetch from './utils/fetch'

const normalize = ({ pageInfo: { totalResults }, items, items: { length: count } }) => ({
  count,
  items: items.map(({
    id: { videoId: id },
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
  const { data } = await fetch('search', {
    query: {
      q: key,
      maxResults: count,
      part: 'snippet',
    },
  })

  const normalizedData = normalize(data)

  return {
    data: normalizedData,
  }
}
