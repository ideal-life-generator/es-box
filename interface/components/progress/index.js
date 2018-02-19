import _style from '_/style' // eslint-disable-line
import _text from '_/text' // eslint-disable-line
import * as clone from './cloners'
import createState from './state'

const { round, floor } = Math

const parseTime = time => {
  const minutes = round(time / 60)
  const pureSeconds = floor(time % 60)
  const seconds = pureSeconds < 10 ? `0${pureSeconds}` : pureSeconds

  return {
    minutes,
    seconds,
  }
}

export default settings => {
  const {
    state,
    emit,
    on,
    setSize,
    setDuration,
    setCurrentTime,
  } = createState()

  on({
    SIZE_CHANGED: () => _style($progress, state.size),
    DURATION_CHANGED: () => {
      // const { duration } = state

      // const minutes = round(duration / 60)
      // const seconds = floor(duration % 60)

      // _text($durationMinutes, minutes)
      // _text($durationSeconds, seconds)
    },
    CURRENT_TIME_CHANGED: () => {
      const { minutes, seconds } = parseTime(state.currentTime)

      _text($currentTimeMinutes, minutes)
      _text($currentTimeSeconds, seconds)
    },
  })

  const $point = clone.point()
  const $currentTimeMinutes = clone.timeNumber()
  const $currentTimeSeparator = clone.timeSeparator()
  const $currentTimeSeconds = clone.timeNumber()
  const $currentTime = clone.time({
    append: [$currentTimeMinutes, $currentTimeSeparator, $currentTimeSeconds],
  })
  const $cursor = clone.cursor({
    append: [$point, $currentTime],
  })
  const $progress = clone.progress({
    append: [$cursor],
  })

  if (settings.size) {
    setSize(settings.size)
  }

  if (settings.duration) {
    setDuration(settings.duration)
  }

  if (settings.currentTime) {
    setCurrentTime(settings.currentTime)
  }

  return {
    $progress,
    $cursor,
    $currentTime,
    $currentTimeSeconds,
    $currentTimeSeparator,
    $currentTimeMinutes,
    $point,
    emit,
    on,
    setSize,
    setDuration,
    setCurrentTime,
  }
}
