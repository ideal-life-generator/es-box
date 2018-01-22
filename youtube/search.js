import axios from './utils/axios'

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

export default async params => {
  const { data } = await axios('search', {
    params: {
      part: 'snippet',
      ...params,
    },
  })

  return normalize(data)
}
