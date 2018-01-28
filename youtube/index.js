import fetch from './utils/fetch'

const normalize = ({ pageInfo: { totalResults }, items }) => ({
  total: totalResults,
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
