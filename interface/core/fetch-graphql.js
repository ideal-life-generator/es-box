import $initFetch from './fetch'

const { assign } = Object

export default params => {
  const $fetch = $initFetch(params)

  return query => $fetch(null, {
    type: 'POST',
    data: {
      query,
    },
  }, {
    data: data => assign(data, { query: data.query.replace(/"undefined"|undefined/g, 'null') }),
  }, {
    data: ({ data }) => data,
  })
}
