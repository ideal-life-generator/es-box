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

@subscriber({
  loading: ({ loading }) => this.emit('loading', loading),
  thumbnail_url_changed: ({ thumbnailUrl }) =>
    this.thumbnail.set({ href: thumbnailUrl }),
  thumbnail_show: ({ showThumbnail }) => this.showHideThumbnail(showThumbnail),
  play: () => {
    const { state, thumbnail, video, subscriber: { emit } } = this

    video.play()

    const updater = () => {
      const { currentTime } = video

      state.currentTime = currentTime

      emit('current_time_changed')

      if (!state.paused) {
        requestAnimationFrame(updater)
      }
    }

    updater()

    if (thumbnail) {
      emit('hide_thumbnail')
    }
  },
  pause: () => {
    const { video } = this

    video.pause()
  },
  source_changed: () => {
    const { state: { source }, source } = this

    _attributes(source, { src: source })
  }
})
export default class VideoPlayer {
  width = null
  height = null
  paused = true
  hover = false
  currentTime = null

  thumbnail = new SVGImage({
    class: 'thumbnail',
    coords: coords.thumbnail
  })
  source = new Source({
    class: 'source',
    type: 'video/mp4'
  })
  video = new Video({
    class: 'video',
    controlslist: 'nodownload',
    coords: coords.video,
    loadstart: () => {
      const { setLoading } = this

      setLoading(true)
    },
    canplay: () => {
      const { setLoading } = this

      setLoading(false)
    },
    append: this.source
  })
  loader = new Loader()
  videoWrapper = new ForeignObject({
    coords: coords.videoWrapper,
    append: [this.video]
  })
  videoPlayer = new SVG({
    coords,
    append: [this.loader.loader, this.videoWrapper]
  })
  node = new SVG({
    mouseenter: () => this.emit('playback_enter'),
    mouseleave: () => this.emit('playback_leave'),
    click: () => (this.paused ? this.play() : this.pause()),
    append: [this.thumbnail, this.loader.loader, this.videoWrapper]
  })

  setSize = ({ width, height }) => {
    const { state, subscriber: { emit } } = this

    _assign(state, { width, height })

    emit('size_changed')
  }

  setThumbnailUrl = (thumbnailUrl) => {
    const { state, subscriber: { emit } } = this

    state.thumbnailUrl = thumbnailUrl

    emit('thumbnail_url_changed')
  }

  setSource = (source) => {
    const { state, subscriber: { emit } } = this

    state.source = source

    emit('source_changed')
  }

  setCurrentTime = (currentTime) => {
    const { state, subscriber: { emit } } = this

    state.currentTime = currentTime

    emit('set_current_time')
  }

  setLoading = (loading) => {
    const { loader: { subscriber: { emit } } } = this

    if (loading) {
      emit('loading')
    } else {
      emit('loaded')
    }
  }

  hover = (option) => {
    const { state, subscriber: { emit } } = this

    state.hover = option

    const { state: { hover } } = this

    if (hover) {
      emit('playback_enter')
    } else {
      emit('playback_leave')
    }
  }

  play = () => {
    const { state, subscriber: { emit } } = this

    state.paused = false

    emit('play')
  }

  pause = () => {
    const { state, subscriber: { emit } } = this

    state.paused = true

    emit('pause')
  }

  showHideThumbnail = animations.showHide(this.thumbnail)

  constructor() {
    const { size, source, currentTime } = options
    const { setSize, setSource, setCurrentTime, subscriber: { on } } = this

    if (size) {
      setSize(size)
    }

    if (source) {
      setSource(source)
    }

    if (typeof currentTime === 'number') {
      setCurrentTime(currentTime)
    }

    if (subscribers) {
      on(subscribers)
    }
  }
}
