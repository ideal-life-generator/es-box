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
    const styledParams = {}

    Object.keys(params).forEach(key => {
      const value = params[key]
      const parsedKey = parseKey(key)

      if (typeof value === 'number') {
        styledParams[parsedKey] = `${value}px`
      } else if (value === null) {
        styledParams[parsedKey] = null
      }
    })

    $style(node, {
      position: 'absolute',
      ...styledParams,
    })
  } else node.forEach(n => $params(n, params))
}
