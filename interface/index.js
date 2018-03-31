import { events, append } from 'interface'
// import $logo from './components/logo'
import { $main } from 'containers/main'
import 'styles/index.sass'

events(document, {
  DOMContentLoaded() {
    const { body: $body } = document

    append($body, [$main])
  }
})
