import clone_ from 'core/clone' // eslint-disable-line
import { coords } from './results'

export default clone_({
  coords: { width: coords.width, height: 2 },
  classes: 'scroll',
})
