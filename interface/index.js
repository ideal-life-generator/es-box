import _ from '_' // eslint-disable-line
import append_ from '_/append' // eslint-disable-line
import events_ from '_/events' // eslint-disable-line
import $search from './components/search'
import $results from './components/results'
// import { $resize } from './components/player'
import './styles/normalize.sass'
import './styles/index.sass'

events_(document, {
  DOMContentLoaded() {
    const { body: $body } = document

    append_($body, [_({
      el: 'img',
      src: './interface/styles/images/logo.jpg',
    }), $search, $results])
  },
})
