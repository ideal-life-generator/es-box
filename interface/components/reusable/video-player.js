import Subscriber from '__/subscriber'
import _cloner from '_/cloner'
import _remove from '_/remove'
import _assign from '__/assign'
import _attributes from '_/attributes'
import _coords from '_/coords'
import Loader from './loader'
import './video-player.sass'


export default class VideoPlayer {
  static clonePlayer = _cloner({ class: 'player' })
  static cloneThumbnail = _cloner({ el: 'img', class: 'thumbnail' })
  static cloneVideo = _cloner({
    el: 'video',
    class: 'video',
    attributes: {
      controlslist: 'nodownload',
    },
  })
  static cloneSource = _cloner({
    el: 'source',
    class: 'source',
    attributes: { type: 'video/mp4' },
  })

  state = {
    width: null,
    height: null,
    paused: true,
    currentTime: null,
  }

  $thumbnail = this.cloneThumbnail()
  $source = this.cloneSource()
  $video = this.cloneVideo({
    events: {
      loadstart: () => {
        const { setLoading } = this

        setLoading(true)
      },
      canplay: () => {
        const { setLoading } = this

        setLoading(false)
      },
      pause: () => {
        const { state } = this

        state.paused = 'PAUSE'
      },
    },
    append: this.$source,
  })
  loader = new Loader()
  $player = this.clonePlayer({
    events: {
      mouseenter: () => {
        const { subscriber: { emit } } = this

        emit('PLAYBACK_HOVER')
      },
      mouseleave: () => {
        const { subscriber: { emit } } = this

        emit('PLAYBACK_HOVER_ENDED')
      },
      click: () => {
        const { state: { paused }, play, pause } = this

        if (paused) {
          play()
        } else {
          pause()
        }
      },
    },
    append: [this.$video, this.loader.$loader, this.$thumbnail],
  })

  subscriber = new Subscriber({
    SIZE_CHANGED: () => {
      const { state: { width, height }, $player } = this

      _coords($player, { width, height })
    },
    SET_CURRENT_TIME: () => {
      const { state: { currentTime }, $video } = this

      $video.currentTime = currentTime
    },
    LOADING: () => {
      const { loader: { setLoading } } = this

      setLoading(true)
    },
    LOADED: () => {
      const { loader: { setLoading } } = this

      setLoading(false)
    },
    SET_THUMBNAIL: thumbnail => {
      const { $thumbnail } = this

      _attributes($thumbnail, { src: thumbnail })
    },
    HIDE_THUMBNAIL: () => {
      const { $thumbnail } = this

      _remove($thumbnail)

      this.$thumbnail = null
    },
    PLAY: () => {
      const {
        state,
        $thumbnail,
        $video,
        subscriber: { emit },
      } = this

      $video.play()

      const updater = () => {
        const { currentTime } = $video

        state.currentTime = currentTime

        emit('CURRENT_TIME_CHANGED')

        if (!state.paused) {
          requestAnimationFrame(updater)
        }
      }

      updater()

      if ($thumbnail) {
        emit('HIDE_THUMBNAIL')
      }
    },
    PAUSE: () => {
      const { $video } = this

      $video.pause()
    },
    SET_SOURCE: source => {
      const { $source } = this

      _attributes($source, { src: source })
    },
  })

  setSize = ({ width, height }) => {
    const { state, subscriber: { emit } } = this

    _assign(state, { width, height })

    emit('SIZE_CHANGED')
  }

  setCurrentTime = currentTime => {
    const { state, subscriber: { emit } } = this

    state.currentTime = currentTime

    emit('SET_CURRENT_TIME')
  }

  setLoading = loading => {
    const { loader: { subscriber: { emit } } } = this

    if (loading) {
      emit('LOADING')
    } else {
      emit('LOADED')
    }
  }

  play = () => {
    const { state, subscriber: { emit } } = this

    state.paused = false

    emit('PLAY')
  }

  pause = () => {
    const { state, subscriber: { emit } } = this

    state.paused = true

    emit('PAUSE')
  }

  constructor(options = {}) {
    const {
      width,
      height,
      subscribers,
      currentTime,
    } = options
    const {
      setSize,
      setCurrentTime,
      subscriber: { on },
    } = this

    if (typeof width === 'number' || typeof height === 'number') {
      setSize({ width, height })
    }

    if (subscribers) {
      on(subscribers)
    }

    if (typeof currentTime === 'number') {
      setCurrentTime(currentTime)
    }
  }
}
