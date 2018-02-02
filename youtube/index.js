import fetch from './utils/fetch'

const normalize = ({ pageInfo: { resultsPerPage, totalResults }, items }) => ({
  count: resultsPerPage,
  items: items.map(({
    id: { videoId: id },
    snippet: {
      title,
      thumbnails,
      publishedAt,
    },
  }) => ({
    id,
    title,
    thumbnails,
    publishedAt,
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

  return normalize(data)
}
