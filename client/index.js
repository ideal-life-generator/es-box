const $ = require('core/create-element') // eslint-disable-line
const { $search } = require('./components/search')
require('./styles/normalize.sass')
require('./styles/main.sass')


document.addEventListener('DOMContentLoaded', () => {
  const $main = $('main', null, $search)

  document.querySelector('body').appendChild($main)
})
