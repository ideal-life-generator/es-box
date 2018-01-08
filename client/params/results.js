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
  x: results.x, y: results.y,
  width: results.width,
}

export const item = {
  width: results.width, height: 50,
}
