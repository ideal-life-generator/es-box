import Subscriber from '__/subscriber'
import _cloner from '_/cloner'
import _style from '_/style'
import _text from '_/text'
import parseTime from '../../utils/parse-time'
import './progress.sass'

export const cloneCursor = _cloner({ class: 'cursor' })
export const clonePoint = _cloner({ class: 'point' })
export const cloneTimeNumber = _cloner({ el: 'span', class: 'number' })
export const cloneTimeSeparator = _cloner({ el: 'span', text: ':' }, true)
export const cloneTime = _cloner({ class: 'time' })
export const cloneCurrent = _cloner({ class: 'current' })
export const cloneProgress = _cloner({ class: 'progress' })

export default class Progress {
  state = {
    width: null,
    duration: null,
    currentTime: null,
  }

  $point = clonePoint()
  $currentTimeMinutes = cloneTimeNumber()
  $currentTimeSeparator = cloneTimeSeparator()
  $currentTimeSeconds = cloneTimeNumber()
  $currentTime = cloneTime({ append: [this.$currentTimeMinutes, this.$currentTimeSeparator, this.$currentTimeSeconds] })
  $cursor = cloneCursor({ append: [this.$point, this.$currentTime] })
  $current = cloneCurrent({ append: this.$cursor })
  $progress = cloneProgress({ append: this.$current })

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
