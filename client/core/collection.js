import clone from 'fast-clone'
import $append from './append'
import $before from './before'

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

export default ($parent, { create, update, move, remove, count }) => {
  let elements$
  let previousElements$
  let previousItems = []

  return nextItems => {
    elements$ = new Map()

    previousItems.forEach(async (previousItem, previousIndex) => {
      const $previousElements = previousElements$.get(previousItem.id)
      const nextIndex = nextItems.findIndex(nextItem => previousItem.id === nextItem.id)

      if (nextIndex >= 0) {
        const { [nextIndex]: nextItem } = nextItems
        const difference = getDifference(nextItem, previousItem)

        if (previousIndex !== nextIndex) {
          move($previousElements, { previousIndex, nextIndex })
        }

        if (difference) {
          resolveUpdate(difference, $previousElements, update)
        }

        elements$.set(previousItem.id, $previousElements)
      } else {
        await remove($previousElements)

        $previousElements.$item.remove()
      }
    })

    nextItems.forEach((nextItem, nextIndex) => {
      const previousIndex = previousItems.findIndex(previousItem => nextItem.id === previousItem.id)

      if (previousIndex === -1) {
        const $elements = create(nextIndex)

        resolveUpdate(nextItem, $elements, update)

        const { [nextIndex]: previous } = previousItems
        if (previous) {
          const $previousElements = previousElements$.get(previous.id)

          $before($elements.$item, $previousElements.$item)
        } else {
          $append($parent, $elements.$item)
        }

        elements$.set(nextItem.id, $elements)
      }
    })

    const { length: previousCount } = previousItems
    const { length: nextCount } = nextItems

    if (previousCount !== nextCount) count($parent, { previousCount, nextCount })

    previousItems = clone(nextItems)

    previousElements$ = elements$
  }
}
