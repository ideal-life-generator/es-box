import _ from '_'

const { keys } = Object

const normalizeAttributes = (options) => {
  const optionsKeys = keys(options)
  const result = {}

  optionsKeys.forEach((optionsKey) => {
    result[optionsKey] = `${options[optionsKey]}px`
  })

  return result
}

export default class SVG {
  constructor(coords, options) {
    this.node = _({
      svg: true,
      attributes: normalizeAttributes(coords),
      ...options
    })
  }
}
