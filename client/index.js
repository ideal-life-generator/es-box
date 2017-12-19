const { $search } = require('./components/search')
// const { $results } = require('./components/results')
// const { $resize } = require('./components/player')
const append = require('./core/append')
require('./styles/normalize.sass')
require('./styles/index.sass')

document.addEventListener('DOMContentLoaded', () => {
  append(document.querySelector('body'), [$search])
})
