import $broadcast from 'core/broadcast' // eslint-disable-line
import {
  screenWidth,
  screenSidesMargin,
} from './screen'

const iconSize = 10

export const search = {
  x: screenSidesMargin, y: 80,
  width: screenWidth - (screenSidesMargin * 2), height: 39,
}

const fieldPadding = {
  left: 13, right: 3,
}

export const field = {
  x: fieldPadding.left,
  width: search.width - search.height - fieldPadding.left - fieldPadding.right, height: search.height,
}

export const input = {
  width: field.width, height: field.height,
}

const textHeight = 25

export const text = {
  y: (field.height - textHeight) / 2,
  width: field.width, height: textHeight,
}

export const clear = {
  x: field.x + field.width,
  width: search.height, height: search.height,
}

export const clearIcon = {
  width: iconSize, height: iconSize,
  x: (clear.width / 2) - (iconSize / 2),
  y: (clear.height / 2) - (iconSize / 2),
}

export const { searchChange } = $broadcast('searchChange')
