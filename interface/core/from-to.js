const calculateNumber = (from, to) => cursor => from + ((to - from) * cursor)

const calculateObject = (keys, from, to) => {
  const calculateHandlers = {}

  keys.forEach(key => {
    const fromNumber = from[key]
    const toNumber = to[key]

    calculateHandlers[key] = calculateNumber(fromNumber, toNumber)
  })

  return cursor => {
    const current = {}

    keys.forEach(key => current[key] = calculateHandlers[key](cursor))

    return current
  }
}

export default (from, to, { duration }, callback) => new Promise(resolve => {
  const startedAt = Date.now()

  let calculate
  if (typeof from === 'number' && typeof to === 'number') {
    calculate = calculateNumber(from, to)
  } else if (typeof from === 'object' && typeof to === 'object') {
    calculate = calculateObject(Object.keys(to), from, to)
  }

  const tick = () => {
    const timeLeft = Date.now() - startedAt

    if (timeLeft < duration) {
      const cursor = timeLeft / duration
      const current = calculate(cursor)

      callback(current)
    } else {
      clearInterval(intervalId) // eslint-disable-line no-use-before-define

      callback(to)

      resolve()
    }
  }

  tick()

  const intervalId = setInterval(tick)
})
