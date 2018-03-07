import append_ from '_/append'
import events_ from '_/events'
// import $logo from './components/logo'
import { $main } from './containers/main'
import './styles/normalize.sass'
import './index.sass'

events_(document, {
  DOMContentLoaded() {
    const { body: $body } = document

    append_($body, [$main])
  },
})
