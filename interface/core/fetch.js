import { stringify as stringifyQuery } from 'qs'
import assign from 'deep-assign'

const { keys } = Object
const { stringify } = JSON

const resolveRequestParsers = (params, parsers) => {
  const { possibleKeys } = resolveRequestParsers

  keys(parsers).forEach((key) => {
    if (possibleKeys.includes(key)) {
      const { [key]: option } = parsers
      const { [key]: param } = params

      if (typeof option === 'function') {
        assign(params, { [key]: option(param) })
      }
    }
  })

  return params
}
resolveRequestParsers.possibleKeys = ['query', 'data']

const resolveResponseParsers = (response, parsers) => {
  const { possibleKeys } = resolveResponseParsers

  keys(parsers).forEach((key) => {
    if (possibleKeys.includes(key)) {
      const { [key]: option } = parsers
      const { [key]: param } = response

      if (typeof option === 'function') {
        assign(response, { [key]: option(param) })
      }
    }
  })

  return response
}
resolveResponseParsers.possibleKeys = ['data']

const createHeaders = (headers) => {
  const headersInstance = new Headers()

  keys(headers).forEach((key) => headersInstance.append(key, headers[key]))

  return headersInstance
}

const createRequest = (source, { baseURL, query, type, headers, data }) => {
  let url = ''
  const params = {}

  if (baseURL) {
    url = baseURL
  }

  if (source) {
    url += `/${source}`
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

export default (baseParams) => async (
  source,
  additionalParams,
  requestParser,
  responseParser
) => {
  const params = assign(baseParams, additionalParams)
  const resolvedRequestParams = requestParser
    ? resolveRequestParsers(params, requestParser)
    : params
  const request = createRequest(source, resolvedRequestParams)

  const fetchResponse = await fetch(request)
  const fetchData = await fetchResponse.json()

  const response = {
    data: fetchData
  }

  const resolvedResponse = responseParser
    ? resolveResponseParsers(response, responseParser)
    : response

  return resolvedResponse
}
