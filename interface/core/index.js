import createNode_ from '_/create-node' // eslint-disable-line
import attributes_ from '_/attributes' // eslint-disable-line
import coords_ from '_/coords' // eslint-disable-line
import class_ from '_/class' // eslint-disable-line
import style_ from '_/style' // eslint-disable-line
import text_ from '_/text' // eslint-disable-line
import append_ from '_/append' // eslint-disable-line
import events_ from '_/events' // eslint-disable-line
import assign_ from '__/assign' // eslint-disable-line
import animateStyle_ from '_/animate-style' // eslint-disable-line
import animateCoords_ from '_/animate-coords' // eslint-disable-line

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

  return node
}
