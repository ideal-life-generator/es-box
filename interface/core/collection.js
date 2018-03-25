import clone from 'fast-clone'
import Subscriber from '__/subscriber'
import _append from '_/append'
import _assign from '__/assign'
import _before from '_/before'
import _resolve from '__/resolve'

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

const resolveUpdate = (elements, data, update) => {
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

export default class Collection {
  $parent = null
  elements = new Map()
  items = []
  count = 0
  methods = {}

  subscriber = new Subscriber({
    CREATE: ({ item, index }, beforeElements) => {
      const {
        $parent,
        methods: { create },
        elements,
        subscriber: { emit },
      } = this

      const createdElements = create(index)

      emit('UPDATE', createdElements, item)

      if (beforeElements) {
        _before(createdElements.$item.node, beforeElements.$item.node)
      } else {
        _append($parent, createdElements.$item.node)
      }

      elements.set(item.id, createdElements)
    },
    UPDATE: (elements, difference) => {
      const { methods: { update } } = this

      resolveUpdate(elements, difference, update)
    },
    MOVE: (elements, { previousIndex, index }, beforeElements) => {
      const {
        $parent,
        methods: { move },
      } = this

      if (beforeElements) {
        _before(elements.$item.node, beforeElements.$item.node)
      } else {
        _append($parent, elements.$item.node)
      }

      move(elements, { previousIndex, index })
    },
    REMOVE: async elements => {
      const { methods: { remove } } = this

      await _resolve(remove(elements))

      elements.$item.node.remove()
    },
    COUNT: counts => {
      const {
        $parent,
        methods: { count },
      } = this

      if (count) {
        count($parent, counts)
      }
    },
  })

  setItems = ({ items, count }) => {
    if (!isArray(items)) {
      throw `Expected data items array, take ${items}`
    }

    if (!(typeof count === 'number')) {
      throw `Expected data count number, take ${count}`
    }

    const {
      items: previousItems,
      count: previousCount,
      elements: previousElements,
      subscriber: { emit },
    } = this

    const elements = new Map()

    previousItems.forEach((previousItem, previousIndex) => {
      const itemElements = previousElements.get(previousItem.id)
      const index = items.findIndex(nextItem => previousItem.id === nextItem.id)

      if (index >= 0) {
        const { [index]: nextItem } = items
        const difference = getDifference(nextItem, previousItem)

        if (difference) {
          emit('UPDATE', itemElements, difference)
        }

        if (previousIndex !== index) {
          const beforeElements = getByIndex(previousElements, index)

          emit('MOVE', itemElements, { previousIndex, index }, beforeElements)
        }

        elements.set(previousItem.id, itemElements)
      } else {
        emit('REMOVE', itemElements)
      }
    })

    items.forEach((item, index) => {
      const previousIndex = previousItems.findIndex(previousItem => item.id === previousItem.id)

      if (previousIndex === -1) {
        const beforeElements = getByIndex(previousElements, index)

        emit('CREATE', { item, index }, beforeElements)
      }
    })

    if (count && count !== previousCount) {
      emit('COUNT', { previousCount, count })
    }

    this.items = clone(items)
    this.elements = elements
    this.count = count
  }

  setMethods = methods => {
    _assign(this.methods, methods)
  }

  constructor($parent, methods = {}) {
    const { setMethods } = this

    this.$parent = $parent

    setMethods(methods)
  }
}
