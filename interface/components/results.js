import _ from '_' // eslint-disable-line
import { results } from '../helpers/results/coords'
// import ﾟuserSongs from './user-songs'
import $youtubeSongs from './youtube-songs'
import '../styles/results.sass'

export default _({
  class: 'results',
  coords: results,
  append: [/*ﾟuserSongs, */$youtubeSongs],
})
