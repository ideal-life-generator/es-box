import create from 'interface'
import SVG from 'svg'
import Line from 'svg/line'
import VideoPlayer from './video-player'
import Progress from './progress'
import playIcon from './icons/play'
import pauseIcon from './icons/video-pause'
import { youtubeItem as coords } from '../coords/index'
import {
  toggleShowHide,
  toggleSwitchShowHide,
  toggleWhiteViolet
} from '../utils/animations'
import './youtube-item.sass'

export default class Item {
  play = playIcon({
    class: 'icon play',
    events: {
      click: () => this.videoPlayer.play()
    }
  })
  pause = pauseIcon({
    class: 'icon pause',
    style: { opacity: 0, display: 'none' },
    events: {
      click: () => this.videoPlayer.pause()
    }
  })
  playback = create({
    class: 'playback',
    events: {
      mouseenter: () => this.videoPlayer.hover(true),
      mouseleave: () => this.videoPlayer.hover(false)
    },
    append: [this.play, this.pause]
  })
  // progress = new Progress({ width: 1030.15929 })
  videoPlayer = new VideoPlayer({
    PLAYBACK_ENTER: () => this.toggleWhiteViolet(true),
    PLAYBACK_LEAVE: () => this.toggleWhiteViolet(false),
    PLAY: () => this.toggleSwitchShowHidePlayback(false),
    PAUSE: () => this.toggleSwitchShowHidePlayback(true)
    // CURRENT_TIME_CHANGED: () =>
    //   this.setCurrentTime(this.videoPlayer.state.currentTime)
  })
  title = create({ el: 'p', class: 'title' })
  separator = new Line(coords.separator, { class: 'separator' })
  item = new SVG(coords.item, {
    class: 'item',
    append: [this.videoPlayer, this.separator]
  })

  toggleSwitchShowHideItem = toggleShowHide(this.item)
  toggleSwitchShowHidePlayback = toggleSwitchShowHide(this.play, this.pause)
  toggleWhiteViolet = toggleWhiteViolet(this.playback, 'stroke')

  constructor() {
    const { toggleSwitchShowHideItem } = this

    toggleSwitchShowHideItem(true)
  }
}
