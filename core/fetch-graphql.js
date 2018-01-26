import $initFetch from './fetch'

const { assign } = Object

export default (source, params) => {
  const $fetch = $initFetch(params)

  return query => $fetch(source, {
    type: 'POST',
    data: {
      query,
    },
  }, {
    request: {
      data: data => assign(data, { query: data.query.replace(/"undefined"|undefined/g, 'null') }),
    },
  })
}
