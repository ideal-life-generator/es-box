import { stringify as stringifyQuery } from 'qs'

const { keys, assign } = Object
const { stringify } = JSON

const resolveRequestParams = (params, options) => {
  keys(options).forEach(key => {
    if (resolveRequestParams.possibleKeys.includes(key)) {
      const { [key]: option } = options
      const { [key]: param } = params

      if (typeof option === 'function') {
        assign(params, { [key]: option(param) })
      }
    }
  })

  return params
}
resolveRequestParams.possibleKeys = ['query', 'data']

const createHeaders = headers => {
  const headersInstance = new Headers()

  keys(headers).forEach(key => headersInstance.append(key, headers[key]))

  return headersInstance
}

const createRequest = (source, { baseUrl, query, type, headers, data }) => {
  let url
  const params = {}

  if (baseUrl) {
    url = `${baseUrl}/${source}`
  } else {
    url = source
  }

  if (query) {
    const stringifiedQuery = stringifyQuery(query)

    url = `${url}?${stringifiedQuery}`
  }

  if (type) {
    assign(params, { method: type })

    if (type === 'POST') {
      if (!headers) {
        headers = {}
      }

      assign(headers, { 'Content-Type': 'application/json' })
    }
  }

  if (headers) {
    assign(params, { headers: createHeaders(headers) })
  }

  if (data) {
    assign(params, { body: stringify(data) })
  }

  return new Request(url, params)
}

export default baseParams => async (source, additionalParams, { request: requestOptions }) => {
  const params = assign(baseParams, additionalParams)
  const resolvedRequestParams = resolveRequestParams(params, requestOptions)

  const request = createRequest(source, resolvedRequestParams)

  const response = await fetch(request)

  return await response.json()
}
