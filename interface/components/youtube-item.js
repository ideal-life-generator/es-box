import _ from '_'
import SVG from 'svg'
import Line from 'svg/line'
import _text from '_/text'
import VideoPlayer from './video-player'
import Progress from './progress'
import playIcon from './icons/play'
import pauseIcon from './icons/video-pause'
import { youtubeItem as youtubeItemCoords } from '../coords/index'
import {
  toggleShowHide,
  toggleSwitchShowHide,
  toggleWhiteViolet,
} from '../utils/animations'
import './youtube-item.sass'

export default class Item {
  coords = youtubeItemCoords;

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
      click: () => this.$videoPlayer.play(),
    },
  })
  $pause = pauseIcon({
    class: 'icon pause',
    style: { opacity: 0, display: 'none' },
    events: {
      click: () => this.$videoPlayer.pause(),
    },
  })
  $playback = _({
    class: 'playback',
    events: {
      mouseenter: () => this.$videoPlayer.hover(true),
      mouseleave: () => this.$videoPlayer.hover(false),
    },
    append: [this.$play, this.$pause],
  })
  // progress = new Progress({ width: 1030.15929 })
  $videoPlayer = new VideoPlayer({ size: { width: playerWidth, height: playerHeight } }, {
    PLAYBACK_ENTER: () => this.toggleWhiteViolet(true),
    PLAYBACK_LEAVE: () => this.toggleWhiteViolet(false),
    PLAY: () => this.toggleSwitchShowHidePlayback(false),
    PAUSE: () => this.toggleSwitchShowHidePlayback(true),
    CURRENT_TIME_CHANGED: () => this.setCurrentTime(this.$videoPlayer.state.currentTime),
  })
  $title = _({ el: 'p', class: 'title' })
  $separator = new Line(this.coords.separator, { class: 'separator' })
  $item = new SVG(this.coords.item, { class: 'item', append: [this.$videoPlayer.$videoPlayer.node, this.$separator.node] })

  toggleSwitchShowHideItem = toggleShowHide(this.$item.node)
  toggleSwitchShowHidePlayback = toggleSwitchShowHide(this.$play, this.$pause)
  toggleWhiteViolet = toggleWhiteViolet(this.$playback, 'stroke')

  setSource = source => {
    const { state, $videoPlayer } = this

    state.source = source

    $videoPlayer.setSource(source)
  }

  setThumbnailUrl = thumbnailUrl => {
    const { state, $videoPlayer } = this

    state.thumbnailUrl = thumbnailUrl

    $videoPlayer.setThumbnailUrl(thumbnailUrl)
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
