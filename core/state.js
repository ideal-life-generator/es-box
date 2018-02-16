// import deepAssign from 'deep-assign'
import _caster from '__/caster' // eslint-disable-line

const { assign, keys } = Object

export default state => {
  const subscribersMap = {}

  const emit = (name, ...args) => {
    // if (helpers) {
    //   keys(data).forEach(key => {
    //     const { [key]: stateValue } = state
    //     const { [key]: dataValue } = data
    //     const { [key]: helper } = helpers

    //     if (stateValue !== dataValue && helper) {
    //       helper(state, data)
    //     }
    //   })
    // }

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

  return assign(state, {
    emit,
    on,
  })
}
