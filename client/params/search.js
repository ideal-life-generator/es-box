import $calculate from 'core/calculate' // eslint-disable-line

const { innerWidth } = window

const searchSidesMargin = 150
const iconSize = 10
export const [search, input, clear, clearIcon] = $calculate([{
  x: searchSidesMargin, y: 80,
  width: innerWidth - (searchSidesMargin * 2), height: 39,
}, ({ width, height }) => ({
  width: width - height, height,
}), ({ height }, { width: bWidth }) => ({
  x: bWidth,
  width: height, height,
}), (a, b, { width, height }) => ({
  width: iconSize, height: iconSize,
  x: (width / 2) - (iconSize / 2),
  y: (height / 2) - (iconSize / 2),
})])
