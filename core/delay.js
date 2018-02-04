export default (hadler, delay) => {
  let timeoutId

  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => hadler(...args), delay)
  }
}
