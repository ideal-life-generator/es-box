import _ from '_' // eslint-disable-line
import cloner_ from '_/cloner' // eslint-disable-line

export default cloner_({
  svg: true,
  attributes: {
    viewBox: '0 0 512 512',
    fill: 'inherit',
  },
  append: _({
    svg: 'path',
    attributes: {
      fill: 'inherit',
      d: 'M96 64l320 192-320 192z',
    },
  }),
}, true)
