import append_ from 'core/append' // eslint-disable-line
import events_ from 'core/events' // eslint-disable-line
import $search from './components/search'
import $results from './components/results'
// import { $resize } from './components/player'
import './styles/normalize.sass'
import './styles/index.sass'

events_(document, {
  DOMContentLoaded() {
    const { body: $body } = document

    append_($body, [$search, $results])
  },
})
