import fromTo_ from '__/from-to' // eslint-disable-line
import style_ from '_/style' // eslint-disable-line

export default (node, params, from, to) =>
  fromTo_(from, to, params, current => style_(node, current))
