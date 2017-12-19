const $ = require('core') // eslint-disable-line
require('../styles/results.sass')

const userSongs = [
  {
    artist: 'Evol Intent',
    title: 'Middle of the night',
  },
  {
    artist: 'Bungle',
    title: 'You',
  },
  {
    artist: 'Makoto',
    title: 'Wue',
  },
]

const $title = $('p', {
  className: 'title',
})
const $item = $('li')
const $list = $('ul')

const $songs = $list.cloneNode()

userSongs.forEach(song => {
  const $song = $item.cloneNode()
  const $songTitle = $title.cloneNode()

  $songTitle.textContent = song.title

  $song.appendChild($songTitle)

  $songs.append($song)
})

const $results = $('div', {
  className: 'results',
}, $songs)

module.exports = {
  $results,
}
