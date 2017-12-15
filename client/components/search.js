const $ = require('core/create-element') // eslint-disable-line
const $clearIcon = require('./icons/clear')
require('../styles/search.sass')

const $input = $('input')
const $clear = $('button', {
  className: 'clear',
}, $clearIcon)

const $search = $('div', {
  className: 'search',
}, [$input, $clear])

module.exports = {
  $search,
}
