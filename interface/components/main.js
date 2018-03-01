import _ from '_'
import $mainPlayer from './main-player'
import $search from './search'
// import Results from './results'
import './main.sass'

// const results = new Results()

export default _({
  class: 'main',
  append: [$mainPlayer, $search/*, results.$results*/],
})
