const $ = require('core') // eslint-disable-line
const $clearIcon = require('./icons/clear')
require('../styles/search.sass')

const {
  innerWidth,
} = window

const searchMargin = 150
const search = {
  size: [innerWidth - (searchMargin * 2), 39],
  position: [searchMargin, 80],
}
const input = {
  size: [search.size[0] - search.size[1], search.size[1]],
}
const clear = {
  size: [search.size[1], search.size[1]],
  position: [input.size[0], 0],
}

const $clear = $('button', {
  className: 'clear',
}, {
  size: clear.size,
  position: clear.position,
  append: $clearIcon,
})

const $input = $('input', {
  className: 'input',
  placeholder: 'Search',
}, {
  size: input.size,
  events: {
    input: e => {
      console.log(e.target.value)
    },
  },
})

const $search = $('div', {
  className: 'search',
  style: {
    borderRadius: `${search.size[1] / 2}px`,
  },
}, {
  size: search.size,
  position: search.position,
  append: [$input, $clear],
})

module.exports = {
  $search,
}
