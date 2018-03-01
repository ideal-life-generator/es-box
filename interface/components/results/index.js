import _ from '_'
// import ﾟuserSongs from './user-songs'
import YoutubeSongs from './youtube'
import './index.sass'

export default class Results {
  youtubeSongs = new YoutubeSongs()
  $results = _({
    class: 'results',
    append: [this.youtubeSongs.$container],
  })
}
