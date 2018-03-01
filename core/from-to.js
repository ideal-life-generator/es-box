import _assign from '__/assign'

const { keys } = Object

const calculateNumber = (from, to) => cursor => from + ((to - from) * cursor)

const calculateObject = (paramsKeys, from, to) => {
  const calculateHandlers = {}

  paramsKeys.forEach(key => {
    const fromNumber = from[key]
    const toNumber = to[key]

    calculateHandlers[key] = calculateNumber(fromNumber, toNumber)
  })

  return cursor => {
    const current = {}

    paramsKeys.forEach(key => current[key] = calculateHandlers[key](cursor))

    return current
  }
}

export default (from, to, { duration = 150, token = {} }, handler) => new Promise((resolve, reject) => {
  _assign(token, { resolve, reject })

  const startedAt = Date.now()

  let calculate
  if (typeof from === 'number' && typeof to === 'number') {
    calculate = calculateNumber(from, to)
  } else if (typeof from === 'object' && typeof to === 'object') {
    calculate = calculateObject(keys(from), from, to)
  }

  const tick = () => {
    const timeLeft = Date.now() - startedAt

    if (timeLeft < duration) {
      const cursor = timeLeft / duration
      const current = calculate(cursor)

      handler(current)
    } else {
      clearInterval(intervalId) // eslint-disable-line no-use-before-define

      handler(to)

      resolve()
    }
  }

  tick()

  const intervalId = setInterval(tick)
})
