import _ from '_'
import Subscriber from '__/subscriber'
import playIcon from '../icons/play'
import pauseIcon from '../icons/pause'
import { toggleSwitchHideShow } from '../../utils/animations'
import './index.sass'

export default class MainPlayer {
  state = {
    pausing: true,
  }

  $play = playIcon({ class: 'icon' })
  $pause = pauseIcon({ class: 'icon' })
  $playback = _({
    class: 'playback',
    append: [this.$play, this.$pause],
    events: {
      click: () => {
        const { state: { pausing }, play, pause } = this

        if (pausing) {
          play()
        } else {
          pause()
        }
      },
    },
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

    state.pausing = false

    emit('PLAY')
  }

  pause = () => {
    const { state, subscriber: { emit } } = this

    state.pausing = true

    emit('PAUSE')
  }
}
