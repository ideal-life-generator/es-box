import create from 'interface'
import SVG from 'svg'
import Line from 'svg/line'
import VideoPlayer from '../../components/video-player'
import Progress from '../../components/progress'
import playIcon from '../../components/icons/play'
import pauseIcon from '../../components/icons/video-pause'
import coords from '../../state/coords/youtube-item'
import animations from '../../utils/animations'
import './youtube-item.sass'

export default class Item {
  id = null
  title = null
  thumbnailUrl = null
  source = null
  duration = null
  top = 0

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

  showHide = animations.showHide(this.item)
  showHidePlayback = animations.showHide(this.play, this.pause)
  whiteViolet = animations.whiteViolet(this.playback, 'stroke')

  show = () => this.showHide(true)
  hide = () => this.showHide(false)
  destroy = async () => {
    await this.hide()

    _.remove(this.$item)
  }

  on = {
    top: (top) => this.videoPlayer.set('top', top),
    title: (title) => this.videoPlayer.set('title', title),
    thumbnailUrl: (thumbnailUrl) =>
      this.videoPlayer.set('thumbnailUrl', thumbnailUrl),
    source: (source) => this.videoPlayer.set('source', source),
    duration: (duration) => this.videoPlayer.set('duration', duration)
  }
}
