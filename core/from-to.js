const { keys } = Object
const { stringify } = JSON

const calculateCurrentNumber = (from, to) => cursor => from + ((to - from) * cursor)

const calculateCurrentObject = (from, to, current = {}) => {
  const calculateHandlers = {}
  const paramsKeys = keys(to)

  paramsKeys.forEach(key => {
    const fromNumber = from[key]
    const toNumber = to[key]

    calculateHandlers[key] = calculateCurrentNumber(fromNumber, toNumber)
  })

  return cursor => {
    paramsKeys.forEach(key => current[key] = calculateHandlers[key](cursor))

    return current
  }
}

const generateCalculateCurrent = (from, to) => {
  if (typeof from === 'number' && typeof to === 'number') {
    return calculateCurrentNumber(from, to)
  } else if (typeof from === 'object' && typeof to === 'object') {
    return calculateCurrentObject(from, to)
  }
}

const calculateCursor = (timeLeft, duration) => {
  if (timeLeft < duration) {
    return timeLeft / duration
  }

  return 1
}

export default (from, to, handler, { duration = 150, token = {} }) => {
  if (typeof from !== typeof to) {
    throw new Error(`Should has similar from ${from} and to ${to} types`)
  }

  return new Promise((resolve, reject) => {
    token.cancel = () => {
      const { progress, cursor } = token
      const currentString = stringify(current)
      const toString = stringify(to)

      if (progress) {
        token.canceled = true

        reject(new Error(`fromTo with paramethers current ${currentString} to ${toString} canceled on cursor ${cursor}`))
      }
    }

    let current = {}
    const startedAt = Date.now()
    const calculateCurrent = generateCalculateCurrent(from, to, current)

    const tick = () => {
      const timeLeft = Date.now() - startedAt
      const cursor = calculateCursor(timeLeft, duration)

      current = calculateCurrent(cursor)

      token.current = current
      token.cursor = cursor

      handler(current)

      const { canceled } = token

      if (timeLeft < duration && !canceled) {
        requestAnimationFrame(tick)
      } else {
        token.progress = false

        resolve()
      }
    }

    token.progress = true

    requestAnimationFrame(tick)
  })
}
