import $calculate from 'core/calculate' // eslint-disable-line
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
