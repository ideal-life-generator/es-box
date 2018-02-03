import events_ from '_/events' // eslint-disable-line
import coords_ from '_/coords' // eslint-disable-line
import eventsRemove_ from '_/events-remove' // eslint-disable-line
import caster_ from '__/caster' // eslint-disable-line

const { document: { body: $body } } = window
const { round } = Math

const calcPosition = (count, size) => count * size

export default (container, { vertical }) => {
  if (vertical) {
    const {
      activator,
      padding,
      size,
      count: startCount,
      min,
      max,
    } = vertical

    let startY = null
    let currentY = null

    let count = startCount
    let step = 0
    let total = count + step
    let previousTotal = step

    const { init, change } = caster_('init', 'change')

    const mousemove = ({ clientY }) => {
      currentY = clientY

      const movedY = currentY - startY

      step = round(movedY / size)

      total = count + step

      if (total < min) {
        total = min
      } else if (total > max) {
        total = max
      }

      if (total !== previousTotal) {
        const containerSize = calcPosition(total, size)

        change(activator, {
          activatorPosition: containerSize + padding,
          containerSize,
          count,
        })

        previousTotal = total
      }
    }

    const unbind = () => {
      count = total

      eventsRemove_($body, {
        mousemove,
        mouseup: unbind,
        mouseleave: unbind,
      })
    }

    events_(activator, {
      mousedown: ({ clientY }) => {
        startY = clientY

        events_($body, {
          mousemove,
          mouseup: unbind,
          mouseleave: unbind,
        })
      },
    })

    const broadcast = ({
      init: initListener,
      change: changeListener,
    }) => {
      init(initListener)
      change(changeListener)

      const containerSize = calcPosition(count, size)

      init(activator, {
        activatorPosition: containerSize + padding,
        containerSize,
        count,
      })
    }

    return { broadcast }
  }
}
