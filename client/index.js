import $search from './components/search'
import { $results } from './components/results'
// import { $resize } from './components/player'
import append from './core/append'
import './styles/normalize.sass'
import './styles/index.sass'

document.addEventListener('DOMContentLoaded', () => {
  const {
    document: {
      body,
    },
  } = window

  append(body, [$search, $results])
})
