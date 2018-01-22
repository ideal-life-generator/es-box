import $ from 'core' // eslint-disable-line
import $collection from 'core/collection' // eslint-disable-line
import $params from 'core/params' // eslint-disable-line
import $text from 'core/text' // eslint-disable-line
import $animateStyle from 'core/animate-style' // eslint-disable-line
import $animateParams from 'core/animate-params' // eslint-disable-line
import { $list, $item, $title } from '../cloners'
import { results, item } from '../params/results'
import { userSongsMock } from '../../graphql/queries/songs'
import '../styles/results.sass'

const { height: itemHeight } = item

const ﾟsongs = $list()

const duration = 150

const update = $collection(ﾟsongs, {
  create: i => {
    const ﾟtitle = $title()

    return {
      ﾟ: $item({
        append: ﾟtitle,
        params: { y: i * itemHeight },
        animateStyle: [{ duration }, { opacity: 0 }, { opacity: 1 }],
      }),
      ﾟtitle,
    }
  },
  update: { title: ({ ﾟtitle }, value) => $text(ﾟtitle, value) },
  move: ({ ﾟ }, { previousIndex: p, nextIndex: n }) =>
    $animateParams(ﾟ, { duration }, { y: p * itemHeight }, { y: n * itemHeight }),
  remove: async ({ ﾟ }) => await $animateStyle(ﾟ, { duration }, { opacity: 1 }, { opacity: 0 }),
  count: (ﾟparent, { nextCount: c }) => $params(ﾟparent, { height: c * itemHeight }),
})

// // update.broadcast(separator({
// //   create: n => $({
// //     node: $separatorTemplate,
// //     params: { y: (n * item.height) - (separator.height / 2) },
// //     animateStyle: [{ duration }, { opacity: 0 }, { opacity: 1 }],
// //   }),
// //   remove: async ($el) => await fromTo(1, 0, duration, opacity => style($el, { opacity })),
// // }))

const {
  0: song0,
  1: song1,
} = userSongsMock

update(userSongsMock)

const step = 1000

setTimeout(() => {
  userSongsMock.splice(1, 1)
  userSongsMock.push(song1)

  update(userSongsMock)
}, step)

setTimeout(() => {
  userSongsMock.shift()

  update(userSongsMock)
}, step * 2)

setTimeout(() => {
  userSongsMock.splice(1, 0, song0)

  update(userSongsMock)
}, step * 3)

export default $({
  classes: 'results',
  params: results,
  append: ﾟsongs,
})
