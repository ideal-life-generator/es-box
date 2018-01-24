import $cloner from 'core/cloner' // eslint-disable-line
import {
  screenWidth,
  screenSidesMargin,
} from './screen'
import { search } from './search'

export const results = {
  x: screenSidesMargin, y: search.y + search.height + 35,
  width: screenWidth - (screenSidesMargin * 2),
}

export const list = {
  width: results.width,
}

export const item = {
  width: results.width, height: 50,
}

export const title = {
  width: item.width, height: 25,
  x: 8, y: (item.height - 25) / 2,
}

export const separator = {
  width: item.width, height: 0,
}


export const $listﾟ = $cloner({
  el: 'ul',
  params: list,
})

export const $itemﾟ = $cloner({
  el: 'li',
  params: item,
  style: { opacity: 0 },
})

export const $titleﾟ = $cloner({
  el: 'p',
  classes: 'title',
  params: title,
})

export const $separatorsﾟ = $cloner({
  el: 'ul',
  params: list,
})

export const $separatorﾟ = $cloner({
  classes: 'separator',
  params: separator,
  style: { opacity: 0 },
})
