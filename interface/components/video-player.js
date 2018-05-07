import SVG from 'svg'
import _ from '_'
import Subscriber from '__/subscriber'
import _remove from '_/remove'
import _attributes from '_/attributes'
import _coords from '_/coords'
import _assign from '__/assign'
import Loader from './loader'
import { youtubeItem as youtubeItemCoords } from '../store/coords'
import animations from '../utils/animations'
import './video-player.sass'

const { videoPlayer: coords } = youtubeItemCoords

@subscribe(
  new Subscriber({
    loading: false,
    thumbnailUrl: null,
    showThumbnail: false,
    play: false,
    currentTime: 0,
    playbackHover: false
  }),
  {
    thumbnailUrl: () => this.$thumbnail.set({ href: this.thumbnailUrl }),
    showThumbnail: () => this.showHideThumbnail(this.showThumbnail),
    play: () => {
      const { $video } = this

      if (this.play) {
        const updater = () => {
          this.emit('currentTime', this.$video.currentTime)

          if (this.play) requestAnimationFrame(updater)
        }

        updater()

        $video.play()

        if (this.showThumbnail) this.emit('showThumbnail', false)
      } else $video.pause()
    },
    source: () => _attributes(this.$source, { src: this.source })
  }
)
export default class VideoPlayer {
  width = null
  height = null
  paused = true
  hover = false
  currentTime = null

  $thumbnail = new SVGImage({
    class: 'thumbnail',
    coords: coords.thumbnail
  })
  $source = new Source({
    class: 'source',
    type: 'video/mp4'
  })
  $video = new Video({
    class: 'video',
    controlslist: 'nodownload',
    coords: coords.video,
    loadstart: () => this.emit('loading', true),
    canplay: () => this.emit('loading', false),
    append: this.source
  })
  $loader = new Loader()
  $videoWrapper = new ForeignObject({
    coords: coords.videoWrapper,
    append: [this.video]
  })
  $videoPlayer = new SVG({
    mouseenter: () => this.emit('playbackHover', true),
    mouseleave: () => this.emit('playbackHover', false),
    click: () => this.emit('play', !this.play),
    append: [this.$thumbnail, this.loader.$loader, this.$videoWrapper]
  })

  showHideThumbnail = animations.showHide(this.$thumbnail)
}
