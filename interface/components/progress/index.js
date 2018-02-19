import _style from '_/style' // eslint-disable-line
import _text from '_/text' // eslint-disable-line
import * as clone from './cloners'
import createState from './state'

export default ({
  size,
  time,
}) => {
  const {
    state,
    emit,
    on,
    setSize,
    setTime,
  } = createState()

  on({
    SIZE_CHANGED: () => _style($progress, state.size),
    TIME_CHANGED: () => {
      const {
        time: { minutes, seconds },
      } = state

      _text($timeMinutes, minutes)
      _text($timeSeconds, seconds)
    },
  })

  const $point = clone.point()
  const $timeMinutes = clone.timeNumber()
  const $timeSeparator = clone.timeSeparator()
  const $timeSeconds = clone.timeNumber()
  const $time = clone.time({
    append: [$timeMinutes, $timeSeparator, $timeSeconds],
  })
  const $cursor = clone.cursor({
    append: [$point, $time],
  })
  const $progress = clone.progress({
    append: [$cursor],
  })

  if (size) {
    setSize(size)
  }

  if (time) {
    setTime(time)
  }

  return {
    $progress,
    $cursor,
    $time,
    $timeSeconds,
    $timeSeparator,
    $timeMinutes,
    $point,
    emit,
    on,
    setSize,
    setTime,
  }
}
