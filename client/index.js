const $main = require('./components/main')
require('./styles/normalize.sass')

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('body').appendChild($main)
})
