import _ from '_'
import Subscriber from '__/subscriber'
import playIcon from '../icons/play'
import pauseIcon from '../icons/pause'
import { toggleSwitchHideShow } from '../../utils/animations'
import './index.sass'

export default class MainPlayer {
  state = {
    play: false,
  }

  $play = playIcon({
    class: 'icon',
    events: {
      click: () => this.play(),
    },
  })
  $pause = pauseIcon({
    class: 'icon',
    events: {
      click: () => this.pause(),
    },
  })
  $playback = _({
    class: 'playback',
    append: [this.$play, this.$pause],
  })
  $mainPlayer = _({
    class: 'main-player',
    append: [this.$playback],
  })

  toggleSwitchHideShow = toggleSwitchHideShow(this.$play, this.$pause)

  subscriber = new Subscriber({
    PLAY: () => this.toggleSwitchHideShow(false),
    PAUSE: () => this.toggleSwitchHideShow(true),
  })

  play = () => {
    const { state, subscriber: { emit } } = this

    state.play = true

    emit('PLAY')
  }

  pause = () => {
    const { state, subscriber: { emit } } = this

    state.play = false

    emit('PAUSE')
  }
}
