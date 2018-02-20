const { keys } = Object

export default class Subscriber {
  subscribersMap = {}

  constructor(map) {
    const { on } = this

    if (map) {
      on(map)
    }
  }

  on = map => {
    const { subscribersMap } = this

    keys(map).forEach(name => {
      const { [name]: subscribers } = subscribersMap
      const { [name]: subscriber } = map

      if (subscribers) {
        subscribers.push(subscriber)
      } else {
        subscribersMap[name] = [subscriber]
      }
    })
  }

  emit = (name, ...args) => {
    const {
      subscribersMap,
      subscribersMap: {
        [name]: subscribers,
      },
    } = this

    if (subscribers) {
      subscribersMap[name].forEach(subscriber => subscriber(...args))
    } else {
      console.warn(`Subscribers for ${name} not defined`)
    }
  }
}
