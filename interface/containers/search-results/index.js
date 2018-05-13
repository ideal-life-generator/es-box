import _ from '_'
import Collection from 'utils/Collection'
import state from 'state/search-results'
import Item from './Item'

const $searchResults = _.create({ el: 'ul', class: 'search-results' })

const collection = new Collection({
  add: () => new Item()
})

state.on({
  items: () => collection.set(state.pick(['items', 'count', 'total']))
})

export default { $searchResults, collection }
