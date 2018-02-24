import _ from '_'
import Subscriber from '__/subscriber'
import _classAdd from '_/class-add'
// import ﾟuserSongs from './user-songs'
import YoutubeSongs from './youtube'
import {
  SMALL_ITEM_HEIGHT,
  NORMAL_ITEM_HEIGHT,
} from './settings'
import './index.sass'

export default class Results {
  static sizeTypes = {
    SMALL: {
      class: 'small',
      itemHeight: SMALL_ITEM_HEIGHT,
    },
    NORMAL: {
      class: 'normal',
      itemHeight: NORMAL_ITEM_HEIGHT,
    },
  }

  state = {
    sizeType: null,
  }

  $youtubeSongs = new YoutubeSongs()
  $results = _({
    class: 'results',
    append: [this.youtubeSongs.$youtubeSongs],
  })

  subscriber = new Subscriber({
    SIZE_CHANGED: () => {
      const {
        sizeTypes,
        state: { sizeType },
        $results,
        $youtubeSongs,
      } = this
      const {
        [sizeType]: {
          class: sizeClass,
          itemHeight,
        },
      } = sizeTypes

      _classAdd($results, sizeClass)

      $youtubeSongs.changeItemHeight(itemHeight)
    },
  })

  changeSize = sizeType => {
    const { state, subscriber: { emit } } = this

    state.sizeType = sizeType

    emit('CHANGE_VIDEO_PLAYER_SIZE')
  }

  constructor() {
    const { changeSize } = this

    changeSize('NORMAL')
  }
}
