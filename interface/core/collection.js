import clone from 'fast-clone'
import append_ from '_/append' // eslint-disable-line
import before_ from '_/before' // eslint-disable-line
import resolve_ from '__/resolve' // eslint-disable-line

const { assign, keys } = Object
const { isArray } = Array

const getDifference = (next, previous) => {
  const difference = {}

  Object.keys(previous).forEach(key => {
    const { [key]: previousValue } = previous
    const { [key]: nextValue } = next

    if (previousValue !== nextValue) {
      difference[key] = nextValue
    }
  })

  Object.keys(next).forEach(key => {
    if (!(key in difference)) {
      const { [key]: nextValue } = next
      const { [key]: previousValue } = previous

      if (nextValue !== previousValue) {
        difference[key] = nextValue
      }
    }
  })

  return difference
}

const resolveUpdate = (data, elements, update) => {
  Object.keys(data).forEach(key => {
    const { [key]: value } = data
    const { [key]: updateHandler } = update

    if (updateHandler) {
      updateHandler(elements, value)
    }
  })
}

const getByIndex = (map, index) => {
  let count = 0
  let foundValue

  map.forEach(value => {
    if (index === count) {
      foundValue = value
    }

    count += 1
  })

  return foundValue
}

export default (parent, methods) => {
  let elements
  let previousElements = new Map()
  let previousItems = []
  let previousCount = 0

  const listeners = {
    create: [],
    remove: [],
  }

  const emit = (name, ...args) => listeners[name].forEach(listener => listener(...args))

  const broadcast = listener => keys(listener).forEach(key => listeners[key].push(listener[key]))

  if (!(methods.data instanceof Function)) {
    throw 'Should data method a function'
  }

  const $update = async (...args) => {
    const {
      items: nextItems,
      count: nextCount,
      total,
    } = await resolve_(methods.data(...args))

    if (!isArray(nextItems)) {
      throw `Expected data items array, take ${nextItems}`
    }

    if (!(typeof nextCount === 'number')) {
      throw `Expected data count number, take ${nextCount}`
    }

    elements = new Map()

    previousItems.forEach(async (previousItem, previousIndex) => {
      const foundElements = previousElements.get(previousItem.id)
      const nextIndex = nextItems.findIndex(nextItem => previousItem.id === nextItem.id)

      if (nextIndex >= 0) {
        const nextElements = foundElements
        const { [nextIndex]: nextItem } = nextItems
        const difference = getDifference(nextItem, previousItem)

        if (difference) {
          resolveUpdate(difference, nextElements, methods.update)
        }

        if (previousIndex !== nextIndex) {
          const beforeElements_ = getByIndex(previousElements, nextIndex)

          if (beforeElements_) {
            before_(nextElements.$item, beforeElements_.$item)
          } else {
            append_(parent, nextElements.$item)
          }

          methods.move(nextElements, { previousIndex, nextIndex })
        }

        elements.set(previousItem.id, nextElements)
      } else {
        const removeResolver = methods.remove(foundElements)

        if (removeResolver instanceof Promise) {
          await removeResolver
        }

        foundElements.$item.remove()

        emit('remove')
      }
    })

    nextItems.forEach((nextItem, nextIndex) => {
      const previousIndex = previousItems.findIndex(previousItem => nextItem.id === previousItem.id)

      if (previousIndex === -1) {
        const createdElements = methods.create(nextIndex)

        resolveUpdate(nextItem, createdElements, methods.update)

        const beforeElements = getByIndex(previousElements, nextIndex)

        if (beforeElements) {
          before_(createdElements.$item, beforeElements.$item)
        } else {
          append_(parent, createdElements.$item)
        }

        elements.set(nextItem.id, createdElements)

        emit('create', nextCount)
      }
    })

    if (methods.count && nextCount !== previousCount) {
      methods.count(parent, { previousCount, nextCount, total })
    }

    previousItems = clone(nextItems)
    previousCount = nextCount

    previousElements = elements
  }

  return assign($update, {
    broadcast,
  })
}
