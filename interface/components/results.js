import _ from '_' // eslint-disable-line
// import ﾟuserSongs from './user-songs'
import $youtubeSongs from './youtube-songs'
import '../styles/results.sass'

export default _({
  class: 'results',
  append: [/*ﾟuserSongs, */$youtubeSongs],
})
