import Subscriber from '__/subscriber'
import _cloner from '_/cloner'
import _style from '_/style'
import _text from '_/text'
import parseTime from '../../utils/parse-time'
import './progress.sass'

export default class Progress {
  static cloneCursor = _cloner({ class: 'cursor' })
  static clonePoint = _cloner({ class: 'point' })
  static cloneTimeNumber = _cloner({ el: 'span', class: 'number' })
  static cloneTimeSeparator = _cloner({ el: 'span', text: ':' }, true)
  static cloneTime = _cloner({ class: 'time' })
  static cloneCurrent = _cloner({ class: 'current' })
  static cloneProgress = _cloner({ class: 'progress' })

  state = {
    width: null,
    duration: null,
    currentTime: null,
  }

  $point = this.clonePoint()
  $currentTimeMinutes = this.cloneTimeNumber()
  $currentTimeSeparator = this.cloneTimeSeparator()
  $currentTimeSeconds = this.cloneTimeNumber()
  $currentTime = this.cloneTime({ append: [this.$currentTimeMinutes, this.$currentTimeSeparator, this.$currentTimeSeconds] })
  $cursor = this.cloneCursor({ append: [this.$point, this.$currentTime] })
  $current = this.cloneCurrent({ append: this.$cursor })
  $progress = this.cloneProgress({ append: this.$current })

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
