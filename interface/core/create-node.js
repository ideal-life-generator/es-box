import createElement_ from '_/create-element'
import createSvg_ from '_/create-svg'

export default ({ el, svg }) => {
  if (svg) return createSvg_(typeof svg === 'string' ? svg : 'svg')

  return createElement_(el || 'div')
}
