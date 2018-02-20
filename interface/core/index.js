import createNode_ from '_/create-node'
import attributes_ from '_/attributes'
import coords_ from '_/coords'
import class_ from '_/class'
import style_ from '_/style'
import text_ from '_/text'
import append_ from '_/append'
import events_ from '_/events'
import assign_ from '__/assign'
import animateStyle_ from '_/animate-style'
import animateCoords_ from '_/animate-coords'

export default ({
  el,
  svg,
  node,
  attributes,
  coords,
  class: classNames,
  style,
  text,
  append,
  events,
  animateStyle,
  animateCoords,
  created,
  ...assign
}) => {
  if (!node) node = createNode_({ el, svg })

  if (attributes) attributes_(node, attributes)
  if (coords) coords_(node, coords)
  if (classNames) class_(node, classNames)
  if (style) style_(node, style)
  if (text) text_(node, text)
  if (append) append_(node, append)
  if (events) events_(node, events)
  if (animateStyle) animateStyle_.call(null, node, ...animateStyle)
  if (animateCoords) animateCoords_.call(null, node, ...animateCoords)
  if (assign) assign_(node, assign)

  if (created) created(node)

  return node
}
