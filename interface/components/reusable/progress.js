import _ from '_'
import Subscriber from '__/subscriber'
import _style from '_/style'
import _text from '_/text'
import parseTime from '../../utils/parse-time'
import './progress.sass'

export default class Progress {
  state = {
    width: null,
    duration: null,
    currentTime: null,
  }

  $point = _({ class: 'point' })
  $currentTimeMinutes = _({ el: 'span', class: 'number' })
  $currentTimeSeparator = _({ el: 'span', text: ':' })
  $currentTimeSeconds = _({ el: 'span', class: 'number' })
  $currentTime = _({ class: 'time', append: [this.$currentTimeMinutes, this.$currentTimeSeparator, this.$currentTimeSeconds] })
  $cursor = _({ class: 'cursor', append: [this.$point, this.$currentTime] })
  $current = _({ class: 'current' })
  $progress = _({ class: 'progress', append: this.$current })

  subscriber = new Subscriber({
    UPDATE_WIDTH: () => {},
    UPDATE_CURRENT: () => {
      const {
        state: {
          width,
          duration,
          currentTime,
        },
        $current,
        $currentTimeMinutes,
        $currentTimeSeconds,
      } = this

      const currentPosition = width * (currentTime / duration)

      _style($current, { width: `${currentPosition}px` })

      const { minutes, seconds } = parseTime(currentTime)

      _text($currentTimeMinutes, minutes)
      _text($currentTimeSeconds, seconds)
    },
  })

  setWidth = width => {
    const { state, subscriber: { emit } } = this

    state.width = width

    emit('UPDATE_WIDTH')
  }

  setDuration = duration => {
    const { state, subscriber: { emit } } = this

    state.duration = duration

    emit('UPDATE_CURRENT')
  }

  setCurrentTime = currentTime => {
    const { state, subscriber: { emit } } = this

    state.currentTime = currentTime

    emit('UPDATE_CURRENT')
  }

  constructor(options = {}) {
    const {
      width,
      duration,
      currentTime,
    } = options
    const {
      setDuration,
      setCurrentTime,
      setWidth,
    } = this

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
