import _ from '_' // eslint-disable-line
import $player from './player'
import $search from './search'
import $results from './results'
import './main.sass'

export default _({
  class: 'main',
  append: [$player, $search, $results],
})
