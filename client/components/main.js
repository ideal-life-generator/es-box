const $ = require('core') // eslint-disable-line
const { $search } = require('./search')
const { $results } = require('./results')
const { $resize } = require('./player')
require('../styles/main.sass')

module.exports = $('main', null, [$search, $('section', {
  className: 'content',
}, [$results, $resize])])
