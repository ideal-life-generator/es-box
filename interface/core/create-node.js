import createElement_ from '_/create-element' // eslint-disable-line
import createSvg_ from '_/create-svg' // eslint-disable-line

export default ({ el, svg }) => {
  if (svg) return createSvg_(typeof svg === 'string' ? svg : 'svg')

  return createElement_(el || 'div')
}
