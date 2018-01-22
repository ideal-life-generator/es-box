export default (count, handler) => {
  let index = 0

  const handle = () => {
    if (count > index) {
      handler(index)

      index += 1

      handle()
    }
  }

  handle()
}
