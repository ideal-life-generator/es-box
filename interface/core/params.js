import $style from './style'

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

export default function $params(node, params) {
  if (!Array.isArray(node)) {
    const style = {}

    Object.keys(params).forEach(key => {
      const value = params[key]
      const parsedKey = parseKey(key)

      if (typeof value === 'number') {
        style[parsedKey] = `${value}px`
      } else if (value === null) {
        style[parsedKey] = null
      }
    })

    if (style.left || style.top) {
      style.position = 'absolute'
    }

    $style(node, style)
  } else node.forEach(n => $params(n, params))
}
