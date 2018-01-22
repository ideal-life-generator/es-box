import $ from './'
import clone from './clone'

export default setup => {
  const $element = $(setup)

  return params => $({
    node: clone($element),
    ...params,
  })
}
