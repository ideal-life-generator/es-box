import Subscriber from '__/subscriber'
import _cloner from '_/cloner'
import _remove from '_/remove'
import _attributes from '_/attributes'
import Loader from './loader'
import './video-player.sass'

export const clonePlayer = _cloner({ class: 'player' })
export const cloneThumbnail = _cloner({ el: 'img', class: 'thumbnail' })
export const cloneVideo = _cloner({
  el: 'video',
  class: 'video',
  attributes: {
    controlslist: 'nodownload',
  },
})
export const cloneSource = _cloner({
  el: 'source',
  class: 'source',
  attributes: { type: 'video/mp4' },
})

export default class VideoPlayer {
  state = {
    playback: null,
    duration: null,
    currentTime: null,
  }

  $thumbnail = cloneThumbnail()
  $source = cloneSource()
  $video = cloneVideo({
    events: $element => ({
      loadstart: () => {
        const { setLoading } = this

        setLoading(true)
      },
      canplay: () => {
        const { setLoading } = this

        setLoading(false)
      },
      loadedmetadata: () => {
        const { setDuration } = this
        const { duration } = $element

        setDuration(duration)
      },
      timeupdate: () => {
        const { setCurrentTime } = this
        const { currentTime } = $element

        setCurrentTime(currentTime)
      },
      play: () => {
        const { state } = this

        state.playback = 'PLAY'
      },
      pause: () => {
        const { state } = this

        state.playback = 'PAUSE'
      },
    }),
    append: this.$source,
  })
  loader = new Loader()
  $player = clonePlayer({
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
        const { $video: { paused }, subscriber: { emit } } = this

        if (paused) {
          emit('PLAY')
        } else {
          emit('PAUSE')
        }
      },
    },
    append: [this.$video, this.loader.$loader, this.$thumbnail],
  })

  subscriber = new Subscriber({
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
      const { $thumbnail, $video, subscriber: { emit } } = this

      if ($thumbnail) {
        emit('HIDE_THUMBNAIL')
      }

      $video.play()
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

  setLoading = loading => {
    const {
      loader: { subscriber: { emit } },
    } = this

    if (loading) {
      emit('LOADING')
    } else {
      emit('LOADED')
    }
  }

  setDuration = duration => {
    const { state, subscriber: { emit } } = this

    state.duration = duration

    emit('DURATION_CHANGED')
  }

  setCurrentTime = currentTime => {
    const { state, subscriber: { emit } } = this

    state.currentTime = currentTime

    emit('CURRENT_TIME_CHANGED')
  }

  constructor(options = {}) {
    const { subscribers, currentTime } = options
    const { setCurrentTime, subscriber: { on } } = this

    if (subscribers) {
      on(subscribers)
    }

    if (typeof currentTime === 'number') {
      setCurrentTime(currentTime)
    }
  }
}
