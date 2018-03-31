import create from 'interface'
import { $mainPlayer } from './main-player'
import { $search } from './search'
import { $results } from './results'
import './main.sass'

export const $main = create({
  class: 'main',
  append: [$mainPlayer, $search, $results]
})
