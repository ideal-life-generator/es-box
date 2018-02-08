import { list, separators } from '../cloners'
import { width } from '../settings'
import yResizer from '../../../helpers/yresizer'

export const $youtubeSongs = list()

export const $separators = separators()

export const $yResizer = yResizer({
  coords: { width },
})
