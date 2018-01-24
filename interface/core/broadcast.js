export default (...names) => {
  const handlers = {}
  const listetners = {}

  const handle = name => (...args) => {
    const { 0: possibleSubscriber } = args

    if (typeof possibleSubscriber === 'function') {
      listetners[name].push(possibleSubscriber)
    } else {
      const { [name]: subscribers } = listetners

      subscribers.forEach(subscriber => subscriber(...args))
    }
  }

  names.forEach(name => {
    handlers[name] = handle(name)

    listetners[name] = []
  })

  return handlers
}
