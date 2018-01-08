import equal from 'fast-deep-equal'
import $append from './append'
import $before from './before'

class Operations extends Array {
  add = (actions, params) => this.push({ actions, params })
  remove = (i, params) => this.splice(i, 0, { actions: ['remove'], params })
}

const indexGet = (items, i) => {
  let count = 0
  let item

  items.forEach(params => {
    if (count === i) {
      item = params
    }

    count += 1
  })

  return item
}

const makeActions = (action, { items, nextItems }, $parent, { create, update, move, remove }, { i, data }) => {
  switch (action) {
    case 'append': {
      const nodes = create(i)
      const { $ref } = nodes

      update(nodes, data)

      $append($parent, $ref)

      nextItems.set(data.id, { i, data, nodes })

      break
    }
    case 'update': {
      const { nodes } = items.get(data.id)

      update(nodes, data)

      nextItems.set(data.id, { i, data, nodes })

      break
    }
    case 'move': {
      const { nodes, i: previ } = items.get(data.id)
      const { nodes: beforeNodes } = indexGet.call(null, items, i)

      $before(nodes.$ref, beforeNodes.$ref)

      move(nodes.$ref, { previ, i })

      break
    }
    case 'remove': {
      const { nodes } = items.get(data.id)

      nodes.$ref.remove()

      remove(nodes.$ref)

      break
    }
  }
}

export default ($parent, { create, update, move, remove, length, start, end }) => {
  let operations
  let previousList = []
  let items = new Map()

  return list => {
    operations = new Operations()
    const nextItems = new Map()

    list.forEach((data, i) => {
      const { id } = data
      const params = { i, data }

      if (items.has(id)) {
        const item = items.get(id)
        const dataIsNotEqual = !equal(item.data, data)
        const indexIsDifferent = item.i !== i
        const actions = []

        if (dataIsNotEqual || indexIsDifferent) {
          if (dataIsNotEqual) {
            actions.push('update')
          }

          if (indexIsDifferent) {
            actions.push('move')
          }

          operations.add(actions, params)
        }
      } else {
        operations.add(['append'], params)
      }
    })

    previousList.some((data, i) => !list.includes(nextData => data.id === nextData.id) && operations.add(['remove'], { i, data }))

    operations.forEach(({ actions, params }) =>
      actions.forEach(action => makeActions(action, { items, nextItems }, $parent, { create, update, move, remove }, params)))

    const { length: l } = list

    if (previousList.length !== list.length) length($parent, l)

    if (start) start()

    if (end) end()

    previousList = list

    items = nextItems
  }
}
