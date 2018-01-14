import $ from 'core' // eslint-disable-line
import clone from 'core/clone' // eslint-disable-line
import collection from 'core/collection' // eslint-disable-line
import params from 'core/params' // eslint-disable-line
import text from 'core/text' // eslint-disable-line
import style from 'core/style' // eslint-disable-line
import fromTo from 'core/from-to' // eslint-disable-line
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

const duration = 150

const change = collection($songs, {
  // create: i => ([{
  //   key: '$title',
  //   node: $titleTemplate,
  // }, {
  //   key: '$item',
  //   node: $itemTemplate,
  //   append: '$title',
  //   params: { y: i * item.height },
  // }]),
  create: i => {
    const $title = $({
      node: $titleTemplate,
    })

    const $item = $({
      node: $itemTemplate,
      append: $title,
      params: { y: i * item.height },
      style: { opacity: 0 },
    })

    fromTo(0, 1, duration, opacity => style($item, { opacity }))

    return { $item, $title }
  },
  update: {
    title: ({ $title }, title) => text($title, title),
  },
  move: ({ $item }, { previousIndex, nextIndex }) =>
    fromTo(previousIndex * item.height, nextIndex * item.height, duration, y => params($item, { y })),
  remove: async ({ $item }) => await fromTo(1, 0, duration, opacity => style($item, { opacity })),
  count: ($parent, { nextCount }) => params($parent, { height: nextCount * item.height }),
})

change(userSongs)

const {
  0: song0,
  1: song1,
} = userSongs

userSongs.splice(1, 1)

userSongs.push(song1)

setTimeout(() => {
  change(userSongs)
}, 1500)

setTimeout(() => {
  userSongs.shift()

  change(userSongs)
}, 3000)

setTimeout(() => {
  userSongs.splice(1, 0, song0)

  change(userSongs)
}, 4500)
