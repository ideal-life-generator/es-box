import _ from '_' // eslint-disable-line
import $mainPlayer from './main-player'
import $search from './search'
import $results from './results'
import './main.sass'

export default _({
  class: 'main',
  append: [$mainPlayer, $search, $results],
})
