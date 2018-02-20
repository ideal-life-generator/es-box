import clone from 'fast-clone'
import append_ from '_/append'
import before_ from '_/before'
import resolve_ from '__/resolve'

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

  const on = listener => keys(listener).forEach(key => listeners[key].push(listener[key]))

  const $update = async ({ items, count }) => {
    if (!isArray(items)) {
      throw `Expected data items array, take ${items}`
    }

    if (!(typeof count === 'number')) {
      throw `Expected data count number, take ${count}`
    }

    elements = new Map()

    previousItems.forEach(async (previousItem, previousIndex) => {
      const foundElements = previousElements.get(previousItem.id)
      const nextIndex = items.findIndex(nextItem => previousItem.id === nextItem.id)

      if (nextIndex >= 0) {
        const nextElements = foundElements
        const { [nextIndex]: nextItem } = items
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

        emit('remove', count)
      }
    })

    items.forEach((nextItem, nextIndex) => {
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

        emit('create', count)
      }
    })

    if (methods.count && count !== previousCount) {
      methods.count(parent, { previousCount, count })
    }

    previousItems = clone(items)
    previousCount = count

    previousElements = elements
  }

  return assign($update, {
    on,
  })
}
