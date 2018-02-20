import _ from '_'
import cloner_ from '_/cloner'

export default cloner_({
  svg: true,
  attributes: {
    viewBox: '0 0 18 20.36',
    stroke: 'inherit',
  },
  append: [
    _({
      svg: 'line',
      attributes: {
        x1: '0.5px',
        x2: '0.5px',
        y2: '20.36px',
      },
    }),
    _({
      svg: 'line',
      attributes: {
        x1: '17.5px',
        x2: '17.5px',
        y2: '20.36px',
      },
    }),
  ],
}, true)
