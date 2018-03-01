import _ from '_'
import Subscriber from '__/subscriber'
import _remove from '_/remove'
import _attributes from '_/attributes'
import _coords from '_/coords'
import Loader from './loader'
import './video-player.sass'

export default class VideoPlayer {
  state = {
    paused: true,
    hover: false,
    currentTime: null,
  }

  $thumbnail = _({ el: 'img', class: 'thumbnail' })
  $source = _({
    el: 'source',
    class: 'source',
    attributes: { type: 'video/mp4' },
  })
  $video = _({
    el: 'video',
    class: 'video',
    attributes: {
      controlslist: 'nodownload',
    },
    events: {
      loadstart: () => {
        const { setLoading } = this

        setLoading(true)
      },
      canplay: () => {
        const { setLoading } = this

        setLoading(false)
      },
    },
    append: this.$source,
  })
  loader = new Loader()
  $player = _({
    class: 'player',
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
    THUMBNAIL_URL_CHANGED: () => {
      const { state: { thumbnailUrl }, $thumbnail } = this

      _attributes($thumbnail, { src: thumbnailUrl })
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
    SOURCE_CHANGED: () => {
      const { state: { source }, $source } = this

      _attributes($source, { src: source })
    },
  })

  setThumbnailUrl = thumbnailUrl => {
    const { state, subscriber: { emit } } = this

    state.thumbnailUrl = thumbnailUrl

    emit('THUMBNAIL_URL_CHANGED')
  }

  setSource = source => {
    const { state, subscriber: { emit } } = this

    state.source = source

    emit('SOURCE_CHANGED')
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

  hover = option => {
    const { state, subscriber: { emit } } = this

    state.hover = option

    const { state: { hover } } = this

    if (hover) {
      emit('PLAYBACK_HOVER')
    } else {
      emit('PLAYBACK_HOVER_ENDED')
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

  constructor(subscribers, options = {}) {
    const {
      source,
      currentTime,
    } = options
    const {
      setSource,
      setCurrentTime,
      subscriber: { on },
    } = this

    if (subscribers) {
      on(subscribers)
    }

    if (source) {
      setSource(source)
    }

    if (typeof currentTime === 'number') {
      setCurrentTime(currentTime)
    }
  }
}
