import events_ from './events'
import coords_ from './coords'
import eventsRemove_ from './events-remove'

const { document: { body: $body } } = window

export default (container, { vertical }) => {
  if (vertical) {
    const {
      activator,
      padding,
      step,
      size,
      min,
      max,
    } = vertical

    coords_(activator, {
      y: (size * step) + padding,
    })

    let startPosition
    let currentPosition
    let lastPosition = 0
    let position = lastPosition
    const halfPosition = size / 2
    const minPosition = size * min
    const maxPosition = size * max

    const mousemove = ({ clientY }) => {
      currentPosition = clientY

      const difference = currentPosition - startPosition

      position = lastPosition + difference

      if (position < minPosition) {
        position = minPosition
      } else if (position > maxPosition) {
        position = maxPosition
      }

      const lastStepPosition = position % size
      if (lastStepPosition < halfPosition) {
        position -= lastStepPosition
      } else if (lastStepPosition > halfPosition) {
        position += size
      }

      coords_(container, { height: position })
      coords_(activator, { y: position + padding })
    }

    const unbind = () => {
      lastPosition = position

      eventsRemove_($body, {
        mousemove,
        mouseup: unbind,
        mouseleave: unbind,
      })
    }

    events_(activator, {
      mousedown: ({ clientY }) => {
        startPosition = clientY

        events_($body, {
          mousemove,
          mouseup: unbind,
          mouseleave: unbind,
        })
      },
    })
  }
}
