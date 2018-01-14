export default (from, to, duration, cb) => new Promise(resolve => {
  const startedAt = Date.now()

  const intervalId = setInterval(() => {
    const timeLeft = Date.now() - startedAt

    if (timeLeft < duration) {
      const cursor = timeLeft / duration
      const difference = to - from
      const current = from + (difference * cursor)

      cb(current)
    } else {
      clearInterval(intervalId)

      cb(to)

      resolve()
    }
  }, 1000 / 60)
})
