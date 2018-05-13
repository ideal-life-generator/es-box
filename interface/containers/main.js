import _ from '_'
// import { $mainPlayer } from './main-player'
// import { $search } from './search'
import { $searchResults } from './search-results'
import './main.sass'

export default _.create({
  class: 'main',
  append: [/*$mainPlayer, $search,*/ $searchResults]
})
