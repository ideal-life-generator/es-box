import _style from '_/style' // eslint-disable-line
import _assign from '__/assign' // eslint-disable-line

const { keys } = Object
const { isArray } = Array

export default function _params(node, params) {
  if (isArray(node)) {
    node.forEach(n => _params(n, params))
  } else {
    const style = {}

    keys(params).forEach(key => {
      const value = params[key]

      if (typeof value === 'number') {
        style[key] = `${value}px`
      } else if (value === null) {
        style[key] = null
      }
    })

    _style(node, _assign(style, { position: 'absolute' }))
  }
}
