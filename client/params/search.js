import $calculate from 'core/calculate' // eslint-disable-line
import {
  screenWidth,
  screenSidesMargin,
} from './screen'

const iconSize = 10

export const search = {
  x: screenSidesMargin, y: 80,
  width: screenWidth - (screenSidesMargin * 2), height: 39,
}

export const input = {
  width: search.width - search.height, height: search.height,
}

export const clear = {
  x: input.width,
  width: search.height, height: search.height,
}

export const clearIcon = {
  width: iconSize, height: iconSize,
  x: (clear.width / 2) - (iconSize / 2),
  y: (clear.height / 2) - (iconSize / 2),
}
