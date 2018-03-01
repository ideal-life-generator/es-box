import _assign from '__/assign'

const { keys } = Object

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

export default (from, to, { duration = 150 }, handler) => {
  if (typeof from !== typeof to) {
    throw new Error(`Should has similar from ${from} and to ${to} types`)
  }

  const token = {}

  token.promise = new Promise((resolve, reject) => {
    token.cancel = () => {
      if (token.progress) {
        reject(new Error('Canceled'))

        token.progress = false
      }
    }

    const startedAt = Date.now()
    const calculateCurrent = generateCalculateCurrent(from, to)

    const tick = () => {
      const timeLeft = Date.now() - startedAt
      const cursor = calculateCursor(timeLeft, duration)
      const current = calculateCurrent(cursor)

      handler(current)

      this.cursor = cursor
      this.current = current

      if (timeLeft < duration) {
        requestAnimationFrame(tick)
      } else {
        resolve()
      }
    }

    requestAnimationFrame(tick)
  })

  return token
}
