import create from 'interface'
import SVG from 'svg'
import Line from 'svg/line'
import VideoPlayer from '../../components/video-player'
import Progress from '../../components/progress'
import playIcon from '../../components/icons/play'
import pauseIcon from '../../components/icons/video-pause'
import { youtubeItem as coords } from '../../store/coords'
import animations from '../../utils/animations'
import './youtube-item.sass'

export default class Item {
  play = playIcon({
    class: 'icon play',
    click: () => this.videoPlayer.emit('play')
  })
  pause = pauseIcon({
    class: 'icon pause',
    click: () => this.videoPlayer.emit('pause')
  })
  playback = create({
    class: 'playback',
    mouseenter: () => this.videoPlayer.emit('hover', true),
    mouseleave: () => this.videoPlayer.emit('hover', false),
    append: [this.play, this.pause]
  })
  progress = new Progress()
  videoPlayer = new VideoPlayer()
  title = create({ el: 'p', class: 'title' })
  separator = new Line({ class: 'separator', coords: coords.separator })
  item = new SVG({
    class: 'item',
    coords: coords.item,
    append: [this.videoPlayer, this.separator]
  })

  showHideItem = animations.showHide(this.item)
  showHidePlayback = animations.showHide(this.play, this.pause)
  whiteViolet = animations.whiteViolet(this.playback, 'stroke')

  constructor() {
    const { videoPlayer, showHideItem } = this

    // coords.on({})

    videoPlayer.on({
      playback_enter: () => this.whiteViolet(true),
      playback_leave: () => this.whiteViolet(false),
      play: () => this.showHidePlayback(false),
      pause: () => this.showHidePlayback(true)
      // 'current time changed': () =>
      //   this.setCurrentTime(this.videoPlayer.state.currentTime)
    })

    showHideItem(true)
  }
}
