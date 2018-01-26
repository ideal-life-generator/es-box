import $append from 'core/append' // eslint-disable-line
import ﾟsearch from './components/search'
import ﾟresults from './components/results'
// import { $resize } from './components/player'
import './styles/normalize.sass'
import './styles/index.sass'

document.addEventListener('DOMContentLoaded', () => {
  const { document: { body } } = window

  $append(body, [ﾟsearch, ﾟresults])
})
