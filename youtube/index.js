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

export const search = async key => {
  const { data } = await fetch('search', {
    query: {
      q: key,
      part: 'snippet',
    },
  })

  return normalize(data)
}
