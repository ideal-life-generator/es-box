import collection_ from '_/collection' // eslint-disable-line
import coords_ from '_/coords' // eslint-disable-line
import text_ from '_/text' // eslint-disable-line
import animateStyle_ from '_/animate-style' // eslint-disable-line
import animateCoords_ from '_/animate-coords' // eslint-disable-line
import separator_ from '_/separator' // eslint-disable-line
import { take_ } from '__/caster' // eslint-disable-line
import { key_ } from '__/normalize' // eslint-disable-line
import resizable_ from '_/resizable' // eslint-disable-line
import * as cloners from '../helpers/results/cloners'
import * as coords from '../helpers/results/coords'
import { searchChange } from '../helpers/search/caster'
import { animationDuration } from '../helpers/results/settings'
import cloneYresizer from '../helpers/yresizer'
import * as youtube from '../../youtube'

const {
  container: { width: containerWidth },
  item: { height: itemHeight },
  separator: { height: separatorHeight },
} = coords

const $youtubeSongs = cloners.list()

const update = collection_($youtubeSongs, {
  data: async ({ key, count }) => await youtube.search({ key, count }),
  create: i => {
    const $title = cloners.title()

    return {
      $item: cloners.item({
        append: $title,
        coords: { y: i * itemHeight },
        animateStyle: [{ duration: animationDuration }, { opacity: 0 }, { opacity: 1 }],
      }),
      $title,
    }
  },
  update: { title: ({ $title }, title) => text_($title, title) },
  move: ({ $item }, { previousIndex, nextIndex }) =>
    animateCoords_($item, { duration: animationDuration }, { y: previousIndex * itemHeight }, { y: nextIndex * itemHeight }),
  remove: async ({ $item }) => await animateStyle_($item, { duration: animationDuration }, { opacity: 1 }, { opacity: 0 }),
  // count: $parent => {
  //   const youtubeSongsHeight = 5 * itemHeight

  //   coords_([$parent], { height: youtubeSongsHeight })
  // },
})

const $separators = cloners.separators()

update.broadcast(separator_($separators, {
  create: i => cloners.separator({
    coords: { y: (i * itemHeight) - (separatorHeight / 2) },
    animateStyle: [{ duration: animationDuration }, { opacity: 0 }, { opacity: 1 }],
  }),
  remove: async ﾟ => await animateStyle_(ﾟ, { duration: animationDuration }, { opacity: 1 }, { opacity: 0 }),
}))

const $yresizer = cloneYresizer({
  coords: { width: containerWidth },
})

const interval = (hadler, delay) => {
  let intervalId
  let inInterval = false
  let lastArgs = null
  let lastHandledArgs = null

  return (...args) => {
    if (!inInterval) {
      hadler(...args)

      lastHandledArgs = args

      intervalId = setInterval(() => {
        if (lastArgs !== lastHandledArgs) {
          hadler(...lastArgs)

          lastHandledArgs = lastArgs
        } else {
          clearInterval(intervalId)

          inInterval = false
        }
      }, delay)

      inInterval = true
    }

    lastArgs = args
  }
}

const intervalUpdate = interval(update, 500)

resizable_($youtubeSongs, {
  vertical: {
    activator: $yresizer,
    count: 4,
    min: 2,
    max: 6,
    size: itemHeight,
    padding: 15,
  },
}).broadcast({
  init: (activator, { activatorPosition, containerSize, count }) => {
    coords_(activator, { y: activatorPosition })
    coords_($youtubeSongs, { height: containerSize })

    update({ count })
  },
  change: (activator, { activatorPosition, containerSize, count }) => {
    coords_(activator, { y: activatorPosition })
    coords_($youtubeSongs, { height: containerSize })

    // intervalUpdate({ count })
  },
})

searchChange(key => intervalUpdate({ key }))

export default cloners.container({
  append: [$youtubeSongs, $separators, $yresizer],
})
