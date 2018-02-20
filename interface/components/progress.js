import Subscriber from '__/subscriber'
import _cloner from '_/cloner'
import _text from '_/text'
import parseTime from '../utils/parse-time'
import './progress.sass'

export const cloneCursor = _cloner({ class: 'cursor' })
export const clonePoint = _cloner({ class: 'point' })
export const cloneTimeNumber = _cloner({ el: 'span', class: 'number' })
export const cloneTimeSeparator = _cloner({ el: 'span', text: ':' }, true)
export const cloneTime = _cloner({ class: 'time' })
export const cloneProgress = _cloner({ class: 'progress' })

export default class Progress {
  state = {
    duration: null,
    currentTime: null,
  }

  $point = clonePoint()
  $currentTimeMinutes = cloneTimeNumber()
  $currentTimeSeparator = cloneTimeSeparator()
  $currentTimeSeconds = cloneTimeNumber()
  $currentTime = cloneTime({ append: [this.$currentTimeMinutes, this.$currentTimeSeparator, this.$currentTimeSeconds] })
  $cursor = cloneCursor({ append: [this.$point, this.$currentTime] })
  $progress = cloneProgress({ append: [this.$cursor] })

  subscriber = new Subscriber({
    DURATION_CHANGED: () => {
      // const { duration } = state

      // const minutes = round(duration / 60)
      // const seconds = floor(duration % 60)

      // _text($durationMinutes, minutes)
      // _text($durationSeconds, seconds)
    },
    CURRENT_TIME_CHANGED: () => {
      const {
        state: { currentTime },
        $currentTimeMinutes,
        $currentTimeSeconds,
      } = this
      const { minutes, seconds } = parseTime(currentTime)

      _text($currentTimeMinutes, minutes)
      _text($currentTimeSeconds, seconds)
    },
  })

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
    const { duration, currentTime } = options
    const { setDuration, setCurrentTime } = this

    if (duration) {
      setDuration(duration)
    }

    if (currentTime) {
      setCurrentTime(currentTime)
    }
  }
}
