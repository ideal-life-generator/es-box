import fromTo_ from '__/from-to'
import coords_ from '_/coords'

export default (node, from, to, options, callback) =>
  fromTo_(from, to, options, current => coords_(node, current), callback)
