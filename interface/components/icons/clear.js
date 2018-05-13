import _ from '_'
import cloner_ from '_/cloner'

export default cloner_(
  {
    svg: true,
    attributes: {
      viewBox: '0 0 15.1 15.1',
      stroke: 'inherit'
    },
    append: [
      _({
        svg: 'line',
        attributes: {
          x1: '0.35px',
          y1: '14.75px',
          x2: '14.75px',
          y2: '0.35px'
        }
      }),
      _({
        svg: 'line',
        attributes: {
          x1: '14.75px',
          y1: '14.75px',
          x2: '0.35px',
          y2: '0.35px'
        }
      })
    ]
  },
  true
)
