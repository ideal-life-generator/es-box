import fromTo_ from '__/from-to'
import style_ from '_/style'

export default (node, from, to, options) =>
  fromTo_(from, to, current => style_(node, current), options)
