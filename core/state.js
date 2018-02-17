// import deepAssign from 'deep-assign'
import _caster from '__/caster' // eslint-disable-line

const { keys } = Object

export default () => {
  const subscribersMap = {}

  const emit = (name, ...args) => {
    const { [name]: subscribers } = subscribersMap

    if (!subscribers) {
      throw new Error(`Subscribers for ${name} not defined`)
    }

    subscribersMap[name].forEach(subscriber => subscriber(...args))
  }

  const on = subscribers => {
    keys(subscribers).forEach(name => {
      const { [name]: subscriber } = subscribers

      if (!subscribersMap[name]) {
        subscribersMap[name] = [subscriber]
      } else {
        subscribersMap[name].push(subscriber)
      }
    })
  }

  return {
    emit,
    on,
  }
}
