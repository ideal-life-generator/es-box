import $ from 'core' // eslint-disable-line
import { results } from '../../settings/results'
import ﾟuserSongs from './user-songs'
import ﾟyoutubeSongs from './youtube-songs'
import '../../styles/results.sass'

export default $({
  classes: 'results',
  params: results,
  append: [ﾟuserSongs, ﾟyoutubeSongs],
})
