const $ = require('core/create-element') // eslint-disable-line
const $clearIcon = require('./icons/clear')
require('../styles/search.sass')

const $input = $('input', {
  placeholder: 'Search',
})
const $clear = $('button', {
  className: 'clear',
  style: {
    flexGrow: 1,
  },
}, $clearIcon)

const $search = $('div', {
  className: 'search',
}, [$input, $clear])

$search.addEventListener('input', event => {
  console.log(event.target.value)
})

module.exports = {
  $search,
}
