import collection_ from '_/collection' // eslint-disable-line
import coords_ from '_/coords' // eslint-disable-line
import text_ from '_/text' // eslint-disable-line
import animateStyle_ from '_/animate-style' // eslint-disable-line
import animateCoords_ from '_/animate-coords' // eslint-disable-line
import separator_ from '_/separator' // eslint-disable-line
import _delayInterval from '__/delay-interval' // eslint-disable-line
import _resizer from '_/resizer' // eslint-disable-line
import * as cloners from '../helpers/results/cloners'
import * as coords from '../helpers/results/coords'
import searchState, { update as searchUpdate } from '../helpers/search/state'
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
})

const $separators = cloners.separators()

update.broadcast(separator_($separators, {
  create: i => cloners.separator({
    coords: { y: (i * itemHeight) - (separatorHeight / 2) },
    animateStyle: [{ duration: animationDuration }, { opacity: 0 }, { opacity: 1 }],
  }),
  remove: async $separator => await animateStyle_($separator, { duration: animationDuration }, { opacity: 1 }, { opacity: 0 }),
}))

const $yresizer = cloneYresizer({
  coords: { width: containerWidth },
})

const intervalUpdate = _delayInterval(update, 500)

_resizer({
  y: {
    activator: $yresizer,
    count: 5,
    min: 2,
    max: 100,
    size: itemHeight,
    padding: 15,
    update: (activator, { size, position, count }) => {
      coords_($youtubeSongs, { height: size })
      coords_(activator, { y: position })

      intervalUpdate({ key: searchState.normalizedValue, count })
    },
  },
})

searchUpdate(() => intervalUpdate({ key: searchState.normalizedValue }))

export default cloners.container({
  append: [$youtubeSongs, $separators, $yresizer],
})
