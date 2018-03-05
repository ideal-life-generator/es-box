export default (hadler, delay, immediately) => {
  let intervalId
  let inInterval = false
  let lastArgs = null
  let lastHandledArgs = null

  return (...args) => {
    if (!inInterval) {
      if (immediately) {
        hadler(...args)
      }

      lastHandledArgs = args

      intervalId = setInterval(() => {
        if (lastArgs !== lastHandledArgs) {
          hadler(...lastArgs)

          lastHandledArgs = lastArgs
        } else {
          clearInterval(intervalId)

          inInterval = false
        }
      }, delay)

      inInterval = true
    }

    lastArgs = args
  }
}
