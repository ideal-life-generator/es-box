import events_ from '_/events' // eslint-disable-line
import coords_ from '_/coords' // eslint-disable-line
import eventsRemove_ from '_/events-remove' // eslint-disable-line
import caster_ from '__/caster' // eslint-disable-line

const { document: { body: $body } } = window

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

    const halfSize = size / 2
    let count = startCount
    let previousCount = count
    let startY = null
    let currentY = null
    let direction = null

    const { init, change } = caster_('init', 'change')

    const mousemove = ({ clientY }) => {
      currentY = clientY

      const movedY = currentY - startY

      if (
        count < max &&
        (((direction === null || direction === false) && movedY >= halfSize) ||
        (direction === true && movedY >= size))
      ) {
        count += 1

        direction = true
      } else if (
        count > min &&
        (((direction === null || direction === true) && movedY <= -halfSize) ||
        (direction === false && movedY <= -size))
      ) {
        count -= 1

        direction = false
      }

      if (count !== previousCount) {
        const containerSize = calcPosition(count, size)

        change(activator, {
          activatorPosition: containerSize + padding,
          containerSize,
          count,
        })

        startY = clientY

        previousCount = count
      }
    }

    const unbind = () => {
      direction = null

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
