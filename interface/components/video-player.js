import _ from '_'
import __ from '__'
// import State, { subscribe } from '__/state'
// import Loader from './loader'
// import { youtubeItem as youtubeItemCoords } from '../store/coords'
import animations from '../utils/animations'
import './video-player.sass'

// const { videoPlayer: coords } = youtubeItemCoords

const coords = {}

const subscribe = (mutations) => (Class) => (...args) => {
  const subscribers = {}

  Class.prototype.emit = function emit(key, value) {
    this[key] = value

    mutations[key].apply(this, [value])

    if (subscribers[key]) {
      subscribers[key].forEach((subscriber) => subscriber(this))
    }
  }

  Class.prototype.on = (key, subscriber) => {
    if (!subscribers[key]) subscribers[key] = []

    subscribers[key].push(subscriber)
  }

  return new Class(...args)
}

@subscribe('thumbnailUrl', 'showThumbnail', 'play', 'source')
export default class VideoPlayer {
  loading = false
  thumbnailUrl = null
  showThumbnail = false
  play = false
  currentTime = 0
  playbackHover = false

  $thumbnail = _({
    svg: 'image',
    class: 'thumbnail',
    coords: coords.thumbnail
  })
  $source = _({
    el: 'source',
    class: 'source',
    type: 'video/mp4'
  })
  $video = _({
    el: 'video',
    class: 'video',
    controlslist: 'nodownload',
    coords: coords.video,
    loadstart: () => this.emit('loading', true),
    canplay: () => this.emit('loading', false),
    append: this.$source
  })
  // $loader = new Loader()
  $videoWrapper = _({
    svg: 'foreignObject',
    coords: coords.videoWrapper,
    append: [this.$video]
  })
  $videoPlayer = _({
    svg: true,
    mouseenter: () => this.emit('playbackHover', true),
    mouseleave: () => this.emit('playbackHover', false),
    click: () => this.emit('play', !this.play),
    append: [this.$thumbnail, /*this.loader.$loader,*/ this.$videoWrapper]
  })

  showHideThumbnail = animations.showHide(this.$thumbnail)

  thumbnailUrl = () => this.$thumbnail.set({ href: this.thumbnailUrl })
  showThumbnail = () => this.showHideThumbnail(this.showThumbnail)
  play = () => {
    const { $video, emit, play, showThumbnail } = this

    if (play) {
      const updater = () => {
        emit('currentTime', $video.currentTime)

        if (play) requestAnimationFrame(updater)
      }

      updater()

      $video.play()

      if (showThumbnail) emit('showThumbnail', false)
    } else $video.pause()
  }
  source = () => _.attributes(this.$source, { src: this.source })
}
