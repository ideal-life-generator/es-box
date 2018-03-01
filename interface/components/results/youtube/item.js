import _ from '_'
import _text from '_/text'
import VideoPlayer from '../../reusable/video-player'
import Progress from '../../reusable/progress'
import playIcon from '../../icons/play'
import pauseIcon from '../../icons/video-pause'
import { show, toggleSwitchHideShow, toggleColor } from '../../../utils/animations'

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
  progress = new Progress({ width: 1030.15929 })
  toggleSwitchHideShow = toggleSwitchHideShow(this.$play, this.$pause)
  toggleWhiteViolet = toggleColor(this.$playback, 'stroke', { r: 255, g: 255, b: 255, a: 0.8 }, { g: 0, b: 222 })
  videoPlayer = new VideoPlayer({
    PLAYBACK_ENTER: () => this.toggleWhiteViolet(),
    PLAYBACK_LEAVE: () => this.toggleWhiteViolet(),
    PLAY: () => this.toggleSwitchHideShow(),
    PAUSE: () => this.toggleSwitchHideShow(),
    CURRENT_TIME_CHANGED: () => this.setCurrentTime(this.videoPlayer.state.currentTime),
  })
  $title = _({ el: 'p', class: 'title' })
  $info = _({
    class: 'info',
    append: [this.$playback, this.$title, this.progress.$progress],
  })
  $content = _({
    class: 'content',
    append: [this.videoPlayer.$player, this.$info],
  })
  $item = _({
    el: 'li',
    class: 'item',
    style: { opacity: 0 },
    append: this.$content,
    created: $element => show($element),
  })

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
  }

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

    progress.setDuration(duration)
  }

  setCurrentTime = currentTime => {
    const { state, progress } = this

    state.currentTime = currentTime

    progress.setCurrentTime(currentTime)
  }
}
