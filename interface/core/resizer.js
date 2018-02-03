import events_ from '_/events' // eslint-disable-line
import coords_ from '_/coords' // eslint-disable-line
import eventsRemove_ from '_/events-remove' // eslint-disable-line
import caster_ from '__/caster' // eslint-disable-line

const { round } = Math

const calcPosition = (count, size) => count * size

export default ({ y }) => {
  if (y) {
    const {
      activator,
      padding,
      size,
      count: startCount,
      min,
      max,
      update: updateListener,
    } = y

    let startY = null

    let step = 0
    let count = startCount + step
    let previousCount = count
    let lastCount = step

    const { update } = caster_('update')

    update(updateListener)

    const updateHandler = () => {
      const containerSize = calcPosition(count, size)

      update(activator, {
        size: containerSize,
        position: containerSize + padding,
        count,
      })
    }

    updateHandler()

    const mousemove = ({ clientY: currentY }) => {
      step = round((currentY - startY) / size)

      count = previousCount + step

      if (count < min) {
        count = min
      } else if (count > max) {
        count = max
      }

      if (count !== lastCount) {
        updateHandler()

        lastCount = count
      }
    }

    const unbind = () => {
      previousCount = count

      eventsRemove_(window, {
        mousemove,
        mouseup: unbind,
      })
    }

    events_(activator, {
      mousedown: ({ clientY }) => {
        startY = clientY

        events_(window, {
          mousemove,
          mouseup: unbind,
        })
      },
    })

    const broadcast = listeners => {
      if (listeners.update) {
        update(listeners.update)
      }
    }

    return { broadcast }
  }
}
