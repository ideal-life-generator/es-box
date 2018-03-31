import fromTo_ from '__/from-to'
import coords_ from '_/coords'

export default (node, from, to, options) =>
  fromTo_(from, to, (current) => coords_(node, current), options)
