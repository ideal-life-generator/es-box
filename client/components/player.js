const $ = require('core/create-element') // eslint-disable-line
require('../styles/player.sass')

const $player = $('div', {
  className: 'player',
}, 'Player')

const $icon = $('div', {
  className: 'icon',
})

const $resize = $('div', {
  className: 'resize',
}, [$icon, $player])

module.exports = {
  $resize,
}
