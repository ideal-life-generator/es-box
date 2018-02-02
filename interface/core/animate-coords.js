import fromTo_ from '__/from-to' // eslint-disable-line
import coords_ from '_/coords' // eslint-disable-line

export default (node, coords, from, to) => fromTo_(from, to, coords, current => coords_(node, current))
