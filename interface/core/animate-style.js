import fromTo_ from '../../_/from-to'
import style_ from './style'

export default (node, params, from, to) =>
  fromTo_(from, to, params, current => style_(node, current))
