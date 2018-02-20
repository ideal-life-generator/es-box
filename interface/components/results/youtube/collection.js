import _collection from '_/collection'
import _text from '_/text'
import { $youtubeSongs } from './elements'
import * as clone from '../cloners'
import { itemHeight } from '../settings'
import separators from './separators'
import VideoPlayer from '../../video-player'
import Progress from '../../progress'
import {
  show,
  hide,
  showAppend,
  hideRemove,
  moveTop,
  changeColor,
} from '../../../utils/animations'

const collection = _collection($youtubeSongs, {
  create: i => {
    const progress = new Progress()

    const createPlay = () => clone.play({
      events: {
        click: () => videoPlayer.subscriber.emit('PLAY'),
        mouseenter: () => videoPlayer.subscriber.emit('PLAYBACK_HOVER'),
        mouseleave: () => videoPlayer.subscriber.emit('PLAYBACK_HOVER_ENDED'),
      },
    })

    const createPause = () => clone.pause({
      events: {
        click: () => videoPlayer.subscriber.emit('PAUSE'),
        mouseenter: () => videoPlayer.subscriber.emit('PLAYBACK_HOVER'),
        mouseleave: () => videoPlayer.subscriber.emit('PLAYBACK_HOVER_ENDED'),
      },
    })

    const videoPlayer = new VideoPlayer()
    videoPlayer.subscriber.on({
      PLAYBACK_HOVER: () => changeColor($playback, 'stroke', { r: 255, g: 255, b: 255, a: 0.8 }, { r: 255, g: 0, b: 222, a: 0.8 }),
      PLAYBACK_HOVER_ENDED: () => changeColor($playback, 'stroke', { r: 255, g: 0, b: 222, a: 0.8 }, { r: 255, g: 255, b: 255, a: 0.8 }),
      PLAY: () => {
        hideRemove($playbackIcon)

        $playbackIcon = createPause()

        showAppend($playback, $playbackIcon)
      },
      PAUSE: () => {
        hideRemove($playbackIcon)

        $playbackIcon = createPlay()

        showAppend($playback, $playbackIcon)
      },
      DURATION_CHANGED: () => {
        progress.setDuration(videoPlayer.state.duration)
      },
      CURRENT_TIME_CHANGED: () => {
        progress.setCurrentTime(videoPlayer.state.currentTime)
      },
    })
    videoPlayer.setCurrentTime(0)

    let $playbackIcon = createPlay()

    const $playback = clone.playback({ append: $playbackIcon })
    const $title = clone.title()

    const $info = clone.info({
      append: [$playback, $title, progress.$progress],
    })
    const $content = clone.content({
      append: [videoPlayer.$player, $info],
    })
    const $item = clone.item({
      coords: { top: i * itemHeight },
      append: $content,
      created: $element => show($element),
    })

    return {
      $item,
      $title,
      videoPlayer,
    }
  },
  update: {
    thumbnailUrl: ({ videoPlayer }, thumbnailUrl) => videoPlayer.subscriber.emit('SET_THUMBNAIL', thumbnailUrl),
    id: ({ videoPlayer }, id) => videoPlayer.subscriber.emit('SET_SOURCE', `http://localhost:3001/youtube/mp3/${id}`),
    title: ({ $title }, title) => _text($title, title),
  },
  move: ({ $item }, { previousIndex, nextIndex }) => moveTop($item, previousIndex * itemHeight, nextIndex * itemHeight),
  remove: ({ $item }) => hide($item),
})

collection.on(separators)

export default collection
