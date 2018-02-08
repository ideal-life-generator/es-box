import _events from '_/events' // eslint-disable-line
import _eventsRemove from '_/events-remove' // eslint-disable-line
import _caster from '__/caster' // eslint-disable-line

const { assign } = Object
const { round } = Math

const calcPosition = (count, size) => count * size

export default (container, { y }) => {
  if (y) {
    const {
      activator,
      padding,
      size,
      count: startCount,
      min,
      max,
    } = y

    let startY = null

    let step = 0
    let count = startCount + step
    let previousCount = count
    let lastCount = count
    let containerSize = calcPosition(count, size)

    const { init, update } = _caster('init', 'update')

    const _update = ({ count: settedCount }) => {
      if (typeof settedCount === 'number') {
        count = settedCount
      }

      if (count < min) {
        count = min
      } else if (count > max) {
        count = max
      }

      if (count !== lastCount) {
        containerSize = calcPosition(count, size)

        update({
          size: containerSize,
          position: padding ? containerSize + padding : containerSize,
          count,
        })

        lastCount = count
      }
    }

    const mousemove = ({ clientY: currentY }) => {
      step = round((currentY - startY) / size)

      count = previousCount + step

      _update({ count })
    }

    const unbind = () => {
      previousCount = count

      _eventsRemove(window, {
        mousemove,
        mouseup: unbind,
      })
    }

    _events(activator, {
      mousedown: ({ clientY }) => {
        startY = clientY

        _events(window, {
          mousemove,
          mouseup: unbind,
        })
      },
    })

    const on = listeners => {
      if (listeners.init) {
        init(listeners.init)

        init({
          size: containerSize,
          position: padding ? containerSize + padding : containerSize,
          count,
        })
      }

      if (listeners.update) {
        update(listeners.update)
      }
    }

    return assign(_update, {
      on,
    })
  }
}
