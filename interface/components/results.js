import _ from 'core' // eslint-disable-line
import { results } from '../helpers/results/coords'
// import ﾟuserSongs from './user-songs'
import $youtubeSongs from './youtube-songs'
import '../styles/results.sass'

export default _({
  classes: 'results',
  coords: results,
  append: [/*ﾟuserSongs, */$youtubeSongs],
})
