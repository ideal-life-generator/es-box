import _ from '_'
import { $mainPlayer } from './main-player'
import { $search } from './search'
import { $results } from './results'
import './main.sass'

export const $main = _({
  class: 'main',
  append: [$mainPlayer, $search, $results],
})
