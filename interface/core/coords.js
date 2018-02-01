import style_ from './style'
import assign_ from '../../_/assign'

const { keys } = Object
const { isArray } = Array

const parseKey = key => {
  switch (key) {
    case 'x': {
      return 'left'
    }
    case 'y': {
      return 'top'
    }
    default: {
      return key
    }
  }
}

export default function params_(node, params) {
  if (isArray(node)) {
    node.forEach(n => params_(n, params))
  } else {
    const style = {}

    keys(params).forEach(key => {
      const value = params[key]
      const parsedKey = parseKey(key)

      if (typeof value === 'number') {
        style[parsedKey] = `${value}px`
      } else if (value === null) {
        style[parsedKey] = null
      }
    })

    style_(node, assign_(style, { position: 'absolute' }))
  }
}
