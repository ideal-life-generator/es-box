import _ from '_'
// import $logo from './components/logo'
import $main from 'containers/main'
import 'styles/index.sass'

_.events(document, {
  DOMContentLoaded() {
    const { body: $body } = document

    _.append($body, $main)
  }
})
