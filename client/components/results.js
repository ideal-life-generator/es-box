import $ from 'core' // eslint-disable-line
import clone from 'core/clone' // eslint-disable-line
import append from 'core/append' // eslint-disable-line
import map from 'core/map' // eslint-disable-line
import params from 'core/params' // eslint-disable-line
import text from 'core/text' // eslint-disable-line
import classes from 'core/classes' // eslint-disable-line
import { results, list, item } from '../params/results'
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

const $list = $({
  element: 'ul',
  params: list,
})

const $songs = $({
  node: $list,
})

export const $results = $({
  classes: 'results',
  params: results,
  append: $songs,
})

const $itemTemplate = $({
  element: 'li',
  params: item,
})
const $titleTemplate = $({
  element: 'p',
  classes: 'title',
})

const move = (start, end, duration, cb) => {
  const startedAt = Date.now()

  const intervalId = setInterval(() => {
    const timeLeft = Date.now() - startedAt

    if (timeLeft < duration) {
      const cursor = timeLeft / duration
      const current = (end - start) * cursor

      cb(current)
    } else {
      clearInterval(intervalId)

      cb(end - start)
    }
  }, 1000 / 60)
}

const update = map($songs, {
  create: i => {
    const $title = $({
      node: $titleTemplate,
    })

    const $ref = $({
      node: $itemTemplate,
      append: $title,
      params: { y: i * item.height },
    })

    return { $ref, $title }
  },
  // update: {
  //   title: ({ $title }, { title }) => text($title, title),
  // },
  update: ({ $title }, { title }) => text($title, title),
  move: ($ref, { previ, i }) => {
    const prevPosition = previ * item.height
    const nextPosition = i * item.height

    move(prevPosition, nextPosition, 200, y => params($ref, { y: prevPosition + y }))
  },
  remove: $ref => classes($ref, 'remove') || console.log('remove'),
  length: ($container, l) => params($container, { height: l * item.height }),
})

update(userSongs)

const song1 = userSongs[1]

userSongs.splice(1, 1)

userSongs.push(song1)

setTimeout(() => update(userSongs), 1500)

setTimeout(() => {
  userSongs.shift()

  console.log(userSongs)

  update(userSongs)
}, 5000)
