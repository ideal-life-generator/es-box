import _ from './'
import clone_ from './clone'

export default (setup, deep) => {
  const node = _(setup)

  return settings => _({
    node: clone_(node, deep),
    ...settings,
  })
}
