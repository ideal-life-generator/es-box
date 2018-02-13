import https from 'https'
import { stringify } from 'querystring'

const request = url => new Promise((resolve, reject) => {
  https.get(url, res => {
    res.setEncoding('utf8')

    let rawData = ''

    res.on('data', chunk => rawData += chunk)

    res.on('end', () => {
      const parsedData = JSON.parse(rawData)

      resolve(parsedData)
    })
  })
})

export default ({ host, query: defaultQuery }) => async (path, { query }) => {
  const queryObject = {
    ...defaultQuery,
    ...query,
  }
  const queryString = stringify(queryObject)
  const url = `${host}/${path}?${queryString}`

  const data = await request(url)

  return {
    data,
  }
}
