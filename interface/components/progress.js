import _ from '_'
import parseTime from 'utils/parse-time'
import './progress.sass'

export default class Progress {
  state = {
    width: null,
    duration: null,
    currentTime: null
  }

  // $point = _({ class: 'point' })
  // $currentTimeMinutes = _({ el: 'span', class: 'number' })
  // $currentTimeSeparator = _({ el: 'span', text: ':' })
  // $currentTimeSeconds = _({ el: 'span', class: 'number' })
  // $currentTime = _({ class: 'time', append: [this.$currentTimeMinutes, this.$currentTimeSeparator, this.$currentTimeSeconds] })
  // $cursor = _({ class: 'cursor', append: [this.$point, this.$currentTime] })
  // $current = _({ class: 'current' })
  $all = _({
    svg: 'line',
    class: 'all',
    attributes: {
      x1: '0px',
      y1: '0px',
      x2: '1030.15929px'
    }
  })
  $now = _({
    svg: 'line',
    class: 'now',
    attributes: {
      x1: '0px',
      y1: '0px',
      x2: '0px'
    }
  })
  $progress = _({
    svg: true,
    class: 'progress',
    append: [this.$all, this.$now]
  })

  subscriber = new Subscriber({
    UPDATE_WIDTH: () => {},
    UPDATE_CURRENT: () => {
      const {
        state: { width, duration, currentTime },
        $now,
        $currentTimeMinutes,
        $currentTimeSeconds
      } = this

      const currentPosition = currentTime / duration * width

      _attributes($now, {
        x2: `${currentPosition}px`
      })

      // _style($progress, {
      //   borderImageSource: `
      //     linear-gradient(
      //       to right,
      //       rgba(255, 0, 222, 0.2) 0px,
      //       rgba(255, 0, 222, 0.8) ${currentPosition - 10}px,
      //       rgba(255, 0, 222, 0.8) ${currentPosition}px,
      //       rgba(255, 255, 255, 0.2) ${currentPosition + 10}px,
      //       rgba(255, 255, 255, 0.2) ${width}px
      //     )`,
      // })

      // const { minutes, seconds } = parseTime(currentTime)

      // _text($currentTimeMinutes, minutes)
      // _text($currentTimeSeconds, seconds)
    }
  })

  setWidth = (width) => {
    const { state, subscriber: { emit } } = this

    state.width = width

    emit('UPDATE_WIDTH')
  }

  setDuration = (duration) => {
    const { state, subscriber: { emit } } = this

    state.duration = duration

    emit('UPDATE_CURRENT')
  }

  updateCurrentTimeInterval = _delayInterval(
    () => this.subscriber.emit('UPDATE_CURRENT'),
    100
  )

  setCurrentTime = (currentTime) => {
    const { state, updateCurrentTimeInterval } = this

    state.currentTime = currentTime

    this.subscriber.emit('UPDATE_CURRENT')
    // updateCurrentTimeInterval()
  }

  constructor(options = {}) {
    const { width, duration, currentTime } = options
    const { setDuration, setCurrentTime, setWidth } = this

    if (width) {
      setWidth(width)
    }

    if (duration) {
      setDuration(duration)
    }

    if (currentTime) {
      setCurrentTime(currentTime)
    }
  }
}
