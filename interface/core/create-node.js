import $createElement from './create-element'
import $createSvg from './create-svg'

export default ({ el, svg }) => {
  if (!svg) return $createElement(el || 'div')

  return $createSvg(typeof svg === 'string' ? svg : 'svg')
}
