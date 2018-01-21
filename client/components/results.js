import $ from 'core' // eslint-disable-line
import clone from 'core/clone' // eslint-disable-line
import collection from 'core/collection' // eslint-disable-line
import params from 'core/params' // eslint-disable-line
import text from 'core/text' // eslint-disable-line
import style from 'core/style' // eslint-disable-line
import fromTo from 'core/from-to' // eslint-disable-line
import animateStyle from 'core/animate-style' // eslint-disable-line
import animateParams from 'core/animate-params' // eslint-disable-line
import { results, list, item, title, separator } from '../params/results'
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
  style: { opacity: 0 },
})

const $titleTemplate = $({
  element: 'p',
  classes: 'title',
})

const $separatorTemplate = $({
  element: 'div',
  classes: 'separator',
  params: separator,
  style: { opacity: 0 },
})

const duration = 150

const update = collection($songs, {
  create: i => {
    const $title = $({
      node: $titleTemplate,
      params: title,
    })

    const $item = $({
      node: $itemTemplate,
      append: $title,
      params: { y: i * item.height },
      animateStyle: [{ duration }, { opacity: 0 }, { opacity: 1 }],
    })

    return { $item, $title }
  },
  update: { title: ({ $title }, t) => text($title, t) },
  move: ({ $item }, { previousIndex: p, nextIndex: n }) =>
    animateParams($item, { duration }, { y: p * item.height }, { y: n * item.height }),
  remove: async ({ $item }) => await animateStyle($item, { duration }, { opacity: 1 }, { opacity: 0 }),
  count: ($parent, { nextCount: c }) => params($parent, { height: c * item.height }),
})

// update.broadcast(separator({
//   create: n => $({
//     node: $separatorTemplate,
//     params: { y: (n * item.height) - (separator.height / 2) },
//     animateStyle: [{ duration }, { opacity: 0 }, { opacity: 1 }],
//   }),
//   remove: async ($el) => await fromTo(1, 0, duration, opacity => style($el, { opacity })),
// }))

const {
  0: song0,
  1: song1,
} = userSongs

update(userSongs)

setTimeout(() => {
  userSongs.splice(1, 1)
  userSongs.push(song1)

  update(userSongs)
}, 800)

setTimeout(() => {
  userSongs.shift()

  update(userSongs)
}, 1600)

setTimeout(() => {
  userSongs.splice(1, 0, song0)

  update(userSongs)
}, 2400)
