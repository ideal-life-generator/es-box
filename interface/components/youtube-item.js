import _ from '_'
import _text from '_/text'
import VideoPlayer from './video-player'
import Progress from './progress'
import playIcon from './icons/play'
import pauseIcon from './icons/video-pause'
import {
  toggleShowHide,
  toggleSwitchShowHide,
  toggleWhiteViolet,
} from '../utils/animations'
import './youtube-item.sass'

const itemWidth = 1236
const itemHeight = 145
const contentTop = 20
const contentHeight = itemHeight - (contentTop * 2)
const infoHeight = contentHeight
const playerHeight = contentHeight
const playerWidth = playerHeight / 0.565
const loaderSize = 25
const loaderLeft = (playerWidth - loaderSize) / 2
const loaderTop = (playerHeight - loaderSize) / 2
const thumbnailHeight = 90
const infoPaddingLeft = 20
const infoLeft = playerWidth + infoPaddingLeft
const infoWidth = itemWidth - infoLeft
const playbackWidth = 18
const playbackHeight = 20.36
const titleTop = 27
const titleHeight = 20
const progressHeight = 1
const progressTop = infoHeight - progressHeight
const progressTimeHeight = 20

export default class Item {
  state = {
    source: null,
    thumbnailUrl: null,
    duration: null,
    currentTime: null,
    title: null,
  }

  $play = playIcon({
    class: 'icon play',
    events: {
      click: () => this.videoPlayer.play(),
    },
  })
  $pause = pauseIcon({
    class: 'icon pause',
    style: { opacity: 0, display: 'none' },
    events: {
      click: () => this.videoPlayer.pause(),
    },
  })
  $playback = _({
    class: 'playback',
    events: {
      mouseenter: () => this.videoPlayer.hover(true),
      mouseleave: () => this.videoPlayer.hover(false),
    },
    append: [this.$play, this.$pause],
  })
  // progress = new Progress({ width: 1030.15929 })
  toggleSwitchShowHidePlayback = toggleSwitchShowHide(this.$play, this.$pause)
  toggleWhiteViolet = toggleWhiteViolet(this.$playback, 'stroke')
  videoPlayer = new VideoPlayer({
    PLAYBACK_ENTER: () => this.toggleWhiteViolet(true),
    PLAYBACK_LEAVE: () => this.toggleWhiteViolet(false),
    PLAY: () => this.toggleSwitchShowHidePlayback(false),
    PAUSE: () => this.toggleSwitchShowHidePlayback(true),
    CURRENT_TIME_CHANGED: () => this.setCurrentTime(this.videoPlayer.state.currentTime),
  })
  $title = _({ el: 'p', class: 'title' })
  $info = _({
    class: 'info',
    append: [this.$playback, this.$title/*, this.progress.$progress*/],
  })
  $content = _({
    class: 'content',
    append: [this.videoPlayer.$player, this.$info],
  })
  $separator = _({
    svg: 'line',
    class: 'separator',
    attributes: {
      x1: '0px',
      y1: `${itemHeight}px`,
      x2: `${itemWidth}px`,
      y2: `${itemHeight}px`,
    },
  })
  $item = _({
    svg: true,
    class: 'item',
    style: { opacity: 0 },
    append: this.$separator,
  })
  toggleSwitchShowHideItem = toggleShowHide(this.$item)

  setSource = source => {
    const { state, videoPlayer } = this

    state.source = source

    videoPlayer.setSource(source)
  }

  setThumbnailUrl = thumbnailUrl => {
    const { state, videoPlayer } = this

    state.thumbnailUrl = thumbnailUrl

    videoPlayer.setThumbnailUrl(thumbnailUrl)
  }

  setTitle = title => {
    const { state, $title } = this

    state.title = title

    _text($title, title)
  }

  setDuration = duration => {
    const { state, progress } = this

    state.duration = duration

    // progress.setDuration(duration)
  }

  setCurrentTime = currentTime => {
    const { state, progress } = this

    state.currentTime = currentTime

    // progress.setCurrentTime(currentTime)
  }

  constructor(options = {}) {
    const {
      source,
      thumbnailUrl,
      title,
      duration,
      currentTime,
    } = options
    const {
      setSource,
      setThumbnailUrl,
      setTitle,
      setDuration,
      setCurrentTime,
      toggleSwitchShowHideItem,
    } = this

    if (source) {
      setSource(source)
    }

    if (thumbnailUrl) {
      setThumbnailUrl(thumbnailUrl)
    }

    if (title) {
      setTitle(title)
    }

    if (typeof duration === 'number') {
      setDuration(duration)
    }

    if (typeof currentTime === 'number') {
      setCurrentTime(currentTime)
    }

    toggleSwitchShowHideItem(true)
  }
}
