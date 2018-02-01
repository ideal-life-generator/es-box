import {
  screenWidth,
  screenSidesMargin,
} from '../screen-coords'
import { search } from '../search/coords'

export const results = {
  x: screenSidesMargin, y: search.y + search.height + 35,
  width: screenWidth - (screenSidesMargin * 2),
}

export const container = {
  width: results.width,
}

export const list = {
  width: container.width,
}

export const item = {
  width: list.width, height: 50,
}

export const title = {
  width: item.width, height: 25,
  x: 8, y: (item.height - 25) / 2,
}

export const separators = {
  width: container.width,
}

export const separator = {
  width: item.width, height: 0,
}

const padding = 6

export const scroll = {
  width: 5,
  x: container.width + padding,
}
