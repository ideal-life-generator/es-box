import $ from './'
import clone from './clone'

export default (setup, deep) => {
  const $element = $(setup)

  return params => $({
    node: clone($element, deep),
    ...params,
  })
}
