import _cloner from '_/cloner' // eslint-disable-line

export const cursor = _cloner({
  class: 'cursor',
})

export const point = _cloner({
  class: 'point',
})

export const timeNumber = _cloner({
  el: 'span',
  class: 'number',
})

export const timeSeparator = _cloner({
  el: 'span',
  text: ':',
}, true)

export const time = _cloner({
  class: 'time',
})

export const progress = _cloner({
  class: 'progress',
})
