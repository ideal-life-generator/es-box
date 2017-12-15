const $ = require('core/create-element') // eslint-disable-line
const setAttributes = require('core/set-attributes') // eslint-disable-line
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

const data = {
  resizedWidth: 300,
  resizedHeight: 180,
  startWidth: null,
  startHeight: null,
  startX: null,
  startY: null,
}

function changeSize() {
  $resize.style.width = `${data.resizedWidth}px`
  $resize.style.height = `${data.resizedHeight}px`
}

function move({ pageX, pageY }) {
  const xDifference = -(pageX - data.startX)
  const yDifference = pageY - data.startY
  const resizedWidth = data.startWidth + xDifference
  const resizedHeight = data.startHeight + yDifference

  if (resizedWidth < data.width) {
    data.resizedWidth = data.width
  } else {
    data.resizedWidth = resizedWidth
  }

  if (resizedHeight < data.height) {
    data.resizedHeight = data.height
  } else {
    data.resizedHeight = resizedHeight
  }

  changeSize()
}

function end() {
  data.startWidth = null
  data.startHeight = null
  data.startX = null
  data.startY = null

  window.removeEventListener('mousemove', move)
  window.removeEventListener('mouseup', end)
}

$icon.addEventListener('mousedown', ({ pageX, pageY }) => {
  data.startWidth = data.resizedWidth
  data.startHeight = data.resizedHeight
  data.startX = pageX
  data.startY = pageY

  window.addEventListener('mousemove', move)
  window.addEventListener('mouseup', end)
})

changeSize()

module.exports = {
  $resize,
}
