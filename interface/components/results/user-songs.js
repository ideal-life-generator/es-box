import $ from 'core' // eslint-disable-line
import $collection from 'core/collection' // eslint-disable-line
import $params from 'core/params' // eslint-disable-line
import $text from 'core/text' // eslint-disable-line
import $events from 'core/events' // eslint-disable-line
import $eventsRemove from 'core/events-remove' // eslint-disable-line
import $animateStyle from 'core/animate-style' // eslint-disable-line
import $animateParams from 'core/animate-params' // eslint-disable-line
import $separator from 'core/separator' // eslint-disable-line
import { $take } from 'core/broadcast' // eslint-disable-line
import { $key } from 'core/normalize' // eslint-disable-line
import ﾟresults from './'
import {
  $containerﾟ,
  $listﾟ,
  $itemﾟ,
  $titleﾟ,
  $separatorsﾟ,
  $separatorﾟ,
  $scrollﾟ,
  item,
  separator,
} from '../../settings/results'
import { searchChange } from '../../settings/search'
import getUserSongs from '../../../graphql/fetch'

const { height: itemHeight } = item

let userSongsHeight
let scrollHeight

const ﾟuserSongs = $listﾟ()

const { document: { body: ﾟbody } } = window


const getClientY = ({ clientY }) => clientY

let scrollStartPosition
let scrollCurrentPosition
let scrollLastPosition = 0
let scrollPosition = scrollLastPosition
let maxScrollPosition

const mousemove = event => {
  scrollCurrentPosition = getClientY(event)

  const scrollDifference = scrollCurrentPosition - scrollStartPosition

  scrollPosition = scrollLastPosition + scrollDifference

  if (scrollPosition < 0) {
    scrollPosition = 0
  } else if (scrollPosition > maxScrollPosition) {
    scrollPosition = maxScrollPosition
  }

  $params(ﾟscroll, { y: scrollPosition })
}

const unbind = () => {
  scrollLastPosition = scrollPosition

  $eventsRemove(ﾟbody, { mousemove, mouseup: unbind, mouseleave: unbind })
}

const ﾟscroll = $scrollﾟ({
  events: {
    mousedown: event => {
      scrollStartPosition = getClientY(event)

      $events(ﾟbody, {
        mousemove,
        mouseup: unbind,
        mouseleave: unbind,
      })
    },
  },
})


const duration = 150

const $update = $collection(ﾟuserSongs, {
  data: async key => await getUserSongs(key, 0),
  create: i => {
    const ﾟtitle = $titleﾟ()

    return {
      ﾟ: $itemﾟ({
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
  count: (ﾟparent, { /*nextCount,*/ total }) => {
    userSongsHeight = 5 * itemHeight
    scrollHeight = (5 / total) * userSongsHeight
    maxScrollPosition = userSongsHeight - scrollHeight

    $params(ﾟparent, { height: userSongsHeight })

    $params(ﾟresults, { height: userSongsHeight })

    $params(ﾟscroll, { height: scrollHeight })
  },
})

const ﾟseparators = $separatorsﾟ()

$update.broadcast($separator(ﾟseparators, {
  create: i => $separatorﾟ({
    params: { y: (i * item.height) - (separator.height / 2) },
    animateStyle: [{ duration }, { opacity: 0 }, { opacity: 1 }],
  }),
  remove: async ﾟ => await $animateStyle(ﾟ, { duration }, { opacity: 1 }, { opacity: 0 }),
}))

$update()

searchChange(value => $update(value))

export default $containerﾟ({
  append: [ﾟuserSongs, ﾟseparators, ﾟscroll],
})
