import fromTo_ from '../../_/from-to'
import coords_ from './coords'

export default (node, coords, from, to) => fromTo_(from, to, coords, current => coords_(node, current))
