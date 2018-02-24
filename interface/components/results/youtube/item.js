import _ from '_'
import _text from '_/text'
import VideoPlayer from '../../reusable/video-player'
import Progress from '../../reusable/progress'
import playIcon from '../../icons/play'
import pauseIcon from '../../icons/video-pause'
import {
  show,
  hideShowSwitch,
  whitePrimary,
  primaryWhite,
} from '../../../utils/animations'

export default class Item {
  state = {
    source: null,
    thumbnailUrl: null,
    title: null,
    duration: null,
    currentTime: null,
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
      click: () => this.videoPlayer.play(),
    },
  })
  $playback = _({
    class: 'playback',
    events: {
      mouseenter: () => this.videoPlayer.subscriber.emit('PLAYBACK_HOVER', true),
      mouseleave: () => this.videoPlayer.subscriber.emit('PLAYBACK_HOVER', false),
    },
    append: [this.$play, this.$pause],
  })
  progress = new Progress()
  videoPlayer = new VideoPlayer({
    PLAYBACK_HOVER: () => whitePrimary(this.$playback, 'stroke'),
    PLAYBACK_HOVER_ENDED: () => primaryWhite(this.$playback, 'stroke'),
    PLAY: () => hideShowSwitch(this.$play, this.$pause),
    PAUSE: () => hideShowSwitch(this.$pause, this.$play),
    CURRENT_TIME_CHANGED: currentTime => this.setCurrentTime(currentTime),
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

    if (duration) {
      setDuration(duration)
    }

    if (currentTime) {
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
    const { state } = this

    state.duration = duration
  }

  setCurrentTime = currentTime => {
    const { state, progress } = this

    state.currentTime = currentTime

    progress.setCurrentTime(currentTime)
  }
}
