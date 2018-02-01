import collection_ from 'core/collection' // eslint-disable-line
import params_ from 'core/params' // eslint-disable-line
import text_ from 'core/text' // eslint-disable-line
import animateStyle_ from 'core/animate-style' // eslint-disable-line
import animateParams_ from 'core/animate-params' // eslint-disable-line
import separator_ from 'core/separator' // eslint-disable-line
import { take_ } from 'core/broadcast' // eslint-disable-line
import { key_ } from 'core/normalize' // eslint-disable-line
import resizable_ from 'core/resizable' // eslint-disable-line
import * as cloners from '../helpers/results/cloners'
import * as coords from '../helpers/results/coords'
import { animationDuration } from '../helpers/results/settings'
import cloneYresizer from '../helpers/yresizer'
import { searchChange } from '../helpers/search/caster'
import * as youtube from '../../youtube'

const {
  item: { height: itemHeight },
  separator: { height: separatorHeight },
} = coords

const $youtubeSongs = cloners.list()

const update = collection_($youtubeSongs, {
  data: async key => await youtube.search(key),
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
    animateParams_($item, { duration: animationDuration }, { y: previousIndex * itemHeight }, { y: nextIndex * itemHeight }),
  remove: async ({ $item }) => await animateStyle_($item, { duration: animationDuration }, { opacity: 1 }, { opacity: 0 }),
  // count: $parent => {
  //   const youtubeSongsHeight = 5 * itemHeight

  //   params_([$parent], { height: youtubeSongsHeight })
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

resizable_($youtubeSongs, {
  vertical: {
    activator: cloneYresizer(),
    padding: 5,
    step: itemHeight,
    size: 10,
    min: 2,
    max: 100,
  },
}).broadcast({
  init: () => console.log('resizer init'),
  change: () => console.log('resizer change'),
})

update()

searchChange(value => update(value))

export default cloners.container({
  append: [$youtubeSongs, $separators],
})
