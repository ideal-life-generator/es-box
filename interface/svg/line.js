import _ from '_'

const { keys } = Object

const normalizeAttributes = ({ x1, y1, x2, y2 }) => {
  const result = {}

  if (x1) result.x1 = `${x1}px`
  if (y1) result.y1 = `${y1}px`
  if (x2) result.x2 = `${x2}px`
  if (y2) result.y2 = `${y2}px`

  return result
}

export default class Line {
  constructor(coords, options) {
    this.node = _({
      svg: 'line',
      attributes: normalizeAttributes(coords),
      ...options,
    })
  }
}
