import $createElement from './create-element'
import $createSvg from './create-svg'

export default ({ element, svg }) => {
  if (!svg) return $createElement(element || 'div')

  return $createSvg(typeof svg === 'string' ? svg : 'svg')
}
