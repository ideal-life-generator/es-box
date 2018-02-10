import _events from '_/events' // eslint-disable-line
import _eventsRemove from '_/events-remove' // eslint-disable-line
import _caster from '__/caster' // eslint-disable-line

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

    let state = 'enabled'

    let startY = null

    let step = 0
    let count = startCount + step
    let previousCount = count
    let lastCount = count
    let containerSize = calcPosition(count, size)
    let maxLimit = max

    const { init, update } = _caster('init', 'update')

    const _update = () => {
      if (count < min) {
        count = min
      } else if (count > maxLimit) {
        count = maxLimit
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

    const change = ({ clientY: currentY }) => {
      step = round((currentY - startY) / size)

      count = previousCount + step

      _update()
    }

    const unbind = () => {
      previousCount = count

      _eventsRemove(window, {
        mousemove: change,
        mouseup: unbind,
      })
    }

    const activate = ({ clientY }) => {
      startY = clientY

      _events(window, {
        mousemove: change,
        mouseup: unbind,
      })
    }

    _events(activator, {
      mousedown: activate,
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

    const setCount = settedCount => {
      if (typeof settedCount === 'number') {
        count = settedCount

        if (count < min) {
          count = min
        } else if (count > maxLimit) {
          count = maxLimit
        }

        if (count !== lastCount) {
          lastCount = count

          previousCount = lastCount
        }
      }

      containerSize = calcPosition(count, size)

      return {
        size: containerSize,
        position: padding ? containerSize + padding : containerSize,
        count,
      }
    }

    const setState = type => {
      state = type

      switch (state) {
        case 'enabled': {
          _events(activator, {
            mousedown: activate,
          })

          break
        }
        case 'disabled': {
          _eventsRemove(activator, {
            mousedown: activate,
          })

          unbind()

          break
        }
        default: {
          break
        }
      }
    }

    const setMax = value => {
      maxLimit = value
    }

    return {
      on,
      setCount,
      setMax,
      setState,
    }
  }
}
