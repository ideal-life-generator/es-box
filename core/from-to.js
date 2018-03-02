const { keys } = Object
const { stringify } = JSON

const calculateCurrentNumber = (from, to) => cursor => from + ((to - from) * cursor)

const calculateCurrentObject = (from, to) => {
  const calculateHandlers = {}
  const paramsKeys = keys(to)

  paramsKeys.forEach(key => {
    const fromNumber = from[key]
    const toNumber = to[key]

    calculateHandlers[key] = calculateCurrentNumber(fromNumber, toNumber)
  })

  return cursor => {
    paramsKeys.forEach(key => from[key] = calculateHandlers[key](cursor))

    return from
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
      const fromString = stringify(from)
      const toString = stringify(to)

      if (progress) {
        token.canceled = true

        reject(new Error(`fromTo with paramethers from ${fromString} to ${toString} canceled on cursor ${cursor}`))
      }
    }

    const startedAt = Date.now()
    const calculateCurrent = generateCalculateCurrent(from, to)

    const tick = () => {
      const timeLeft = Date.now() - startedAt
      const cursor = calculateCursor(timeLeft, duration)
      const current = calculateCurrent(cursor)
      const { canceled } = token

      handler(current)

      token.cursor = cursor

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
