import __ from '__'

const { keys } = Object

export default class Store {
  subscribers = {}

  mutate = (key, value) => {
    const { subscribers: { [key]: subscribersSet } } = this

    this[key] = value

    if (subscribersSet) {
      subscribersSet.forEach((subscriber) => subscriber(this))
    }
  }

  on = (key, subscriber) => {
    const { subscribers } = this

    if (typeof key === 'object') {
      const subscribersObject = key

      keys(subscribersObject).forEach((objectSubscriberKey) => {
        const { [objectSubscriberKey]: objectSubscriber } = subscribersObject

        this.on(objectSubscriberKey, objectSubscriber)
      })
    } else {
      if (!subscribers[key]) {
        subscribers[key] = []
      }

      const subscribersSet = subscribers[key]

      subscribersSet.push(subscriber)
    }
  }

  constructor(defaultState, subscribers) {
    __.assign(this, defaultState)

    this.on(subscribers)
  }
}
