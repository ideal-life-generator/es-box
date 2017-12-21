import $ from 'core' // eslint-disable-line
import clone from 'core/clone' // eslint-disable-line
import text from 'core/text' // eslint-disable-line
import append from 'core/append' // eslint-disable-line
import map from 'core/map' // eslint-disable-line
import '../styles/results.sass'

const userSongs = [
  {
    id: 0,
    title: 'Evol Intent - Middle of the night',
  },
  {
    id: 1,
    title: 'Bungle - You',
  },
  {
    id: 2,
    title: 'Makoto - Wue',
  },
]

const $title = $({
  element: 'p',
  classes: 'title',
})
const $item = $({ element: 'li' })
const $list = $({ element: 'ul' })

const $songs = $({
  node: $list,
})

const update = map({
  create: ({ id, title }) => {
    const $songTitle = $({
      node: $title,
      text: title,
    })

    const $song = $({
      node: $item,
      append: $songTitle,
    })

    append($songs, $song)

    return { key: id, $song, $songTitle }
  },
  update: ({ $songTitle }, { title }) => text($songTitle, title),
})

update(userSongs)

userSongs[1].title = 'Bungle - Back to mars'

userSongs.push({
  id: 3,
  title: 'Michael Jackson - Black and white',
})

setTimeout(() => update(userSongs), 1500)

export const $results = $({
  classes: 'results',
  append: $songs,
})
