const $ = require('core') // eslint-disable-line
const $clearIcon = require('./icons/clear')
require('../styles/search.sass')

const $input = $('input', {
  className: 'input',
  placeholder: 'Search',
}, null, {
  position: {
    top: 0,
    left: 0,
    right: 35,
    bottom: 0,
  },
})
const $clear = $('button', {
  className: 'clear',
  style: {
    flexGrow: 1,
  },
}, $clearIcon, {
  position: {
    top: 0,
    right: 2.5,
  },
})

const $search = $('div', {
  className: 'search',
}, [$input], {
  position: {
    top: 65,
    left: 150,
    right: 150,
  },
})

$search.addEventListener('input', event => {
  console.log(event.target.value)
})

module.exports = {
  $search,
}
