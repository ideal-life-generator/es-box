import clone from 'fast-clone'
import $append from './append'
import $before from './before'

const { assign, keys } = Object

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

const resolveUpdate = (data, elementsﾟ, update) => {
  Object.keys(data).forEach(key => {
    const { [key]: value } = data
    const { [key]: updateHandler } = update

    if (updateHandler) {
      updateHandler(elementsﾟ, value)
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

export default (parentﾟ, { create, update, move, remove, count }) => {
  let elementsﾟ
  let previousElementsﾟ = new Map()
  let previousItems = []

  const listeners = {
    create: [],
    remove: [],
  }

  const emit = (name, ...args) => listeners[name].forEach(listener => listener(...args))

  const broadcast = listener => keys(listener).forEach(key => listeners[key].push(listener[key]))

  const $update = (nextItems) => {
    elementsﾟ = new Map()

    const { length: previousCount } = previousItems
    const { length: nextCount } = nextItems

    previousItems.forEach(async (previousItem, previousIndex) => {
      const foundElementsﾟ = previousElementsﾟ.get(previousItem.id)
      const nextIndex = nextItems.findIndex(nextItem => previousItem.id === nextItem.id)

      if (nextIndex >= 0) {
        const nextElementsﾟ = foundElementsﾟ
        const { [nextIndex]: nextItem } = nextItems
        const difference = getDifference(nextItem, previousItem)

        if (difference) {
          resolveUpdate(difference, nextElementsﾟ, update)
        }

        if (previousIndex !== nextIndex) {
          const $beforeElements = getByIndex(previousElementsﾟ, nextIndex)

          if ($beforeElements) {
            $before(nextElementsﾟ.ﾟ, $beforeElements.ﾟ)
          } else {
            $append(parentﾟ, nextElementsﾟ.ﾟ)
          }

          move(nextElementsﾟ, { previousIndex, nextIndex })
        }

        elementsﾟ.set(previousItem.id, nextElementsﾟ)
      } else {
        const removeResolver = remove(foundElementsﾟ)

        if (removeResolver instanceof Promise) {
          await removeResolver
        }

        foundElementsﾟ.ﾟ.remove()

        emit('remove')
      }
    })

    nextItems.forEach((nextItem, nextIndex) => {
      const previousIndex = previousItems.findIndex(previousItem => nextItem.id === previousItem.id)

      if (previousIndex === -1) {
        const createdElementsﾟ = create(nextIndex)

        resolveUpdate(nextItem, createdElementsﾟ, update)

        const beforeElementsﾟ = getByIndex(previousElementsﾟ, nextIndex)

        if (beforeElementsﾟ) {
          $before(createdElementsﾟ.ﾟ, beforeElementsﾟ.ﾟ)
        } else {
          $append(parentﾟ, createdElementsﾟ.ﾟ)
        }

        elementsﾟ.set(nextItem.id, createdElementsﾟ)

        emit('create', nextCount)
      }
    })

    if (nextCount !== previousCount) {
      count(parentﾟ, { nextCount, previousCount })
    }

    previousItems = clone(nextItems)

    previousElementsﾟ = elementsﾟ
  }

  return assign($update, {
    broadcast,
  })
}
