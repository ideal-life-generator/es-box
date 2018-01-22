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

const resolveUpdate = (data, $elements, update) => {
  Object.keys(data).forEach(key => {
    const { [key]: value } = data
    const { [key]: updateHandler } = update

    if (updateHandler) {
      updateHandler($elements, value)
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

export default ($parent, { create, update, move, remove, count }) => {
  let elements$
  let previousElements$ = new Map()
  let previousItems = []

  const listeners = {
    create: [],
    remove: [],
  }

  const emit = (name, ...args) => listeners[name].forEach(listener => listener(...args))

  const broadcast = listener => keys(listener).forEach(key => listeners[key].push(listener[key]))

  const $update = (nextItems) => {
    elements$ = new Map()

    const { length: previousCount } = previousItems
    const { length: nextCount } = nextItems

    previousItems.forEach(async (previousItem, previousIndex) => {
      const $previousElements = previousElements$.get(previousItem.id)
      const nextIndex = nextItems.findIndex(nextItem => previousItem.id === nextItem.id)

      if (nextIndex >= 0) {
        const $nextElements = $previousElements
        const { [nextIndex]: nextItem } = nextItems
        const difference = getDifference(nextItem, previousItem)

        if (difference) {
          resolveUpdate(difference, $nextElements, update)
        }

        if (previousIndex !== nextIndex) {
          const $beforeElements = getByIndex(previousElements$, nextIndex)

          if ($beforeElements) {
            $before($nextElements.ﾟ, $beforeElements.ﾟ)
          } else {
            $append($parent, $nextElements.ﾟ)
          }

          move($nextElements, { previousIndex, nextIndex })
        }

        elements$.set(previousItem.id, $nextElements)
      } else {
        const removeResolver = remove($previousElements.ﾟ)

        if (removeResolver instanceof Promise) {
          await removeResolver
        }

        $previousElements.ﾟ.remove()

        emit('remove')
      }
    })

    nextItems.forEach((nextItem, nextIndex) => {
      const previousIndex = previousItems.findIndex(previousItem => nextItem.id === previousItem.id)

      if (previousIndex === -1) {
        const $elements = create(nextIndex)

        resolveUpdate(nextItem, $elements, update)

        const beforeElements$ = getByIndex(previousElements$, nextIndex)

        if (beforeElements$) {
          $before($elements.ﾟ, beforeElements$.ﾟ)
        } else {
          $append($parent, $elements.ﾟ)
        }

        elements$.set(nextItem.id, $elements)

        emit('create', nextCount)
      }
    })

    if (nextCount !== previousCount) {
      count($parent, { nextCount, previousCount })
    }

    previousItems = clone(nextItems)

    previousElements$ = elements$
  }

  return assign($update, {
    broadcast,
  })
}
