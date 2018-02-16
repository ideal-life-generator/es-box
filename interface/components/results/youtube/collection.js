import _collection from '_/collection' // eslint-disable-line
import _attributes from '_/attributes' // eslint-disable-line
import _text from '_/text' // eslint-disable-line
import _append from '_/append' // eslint-disable-line
import _remove from '_/remove' // eslint-disable-line
import _animateCoords from '_/animate-coords' // eslint-disable-line
import _animateStyle from '_/animate-style' // eslint-disable-line
import { $youtubeSongs } from './elements'
import { item, player, mainButton, play, pause, video, thumbnail, title, source } from '../cloners'
import { itemHeight, animationDuration } from '../settings'
import separators from './separators'

const newPlay = ($video, $mainButton) => {
  const $play = play({
    events: {
      click: async () => {
        $video.play()

        _animateStyle($play, { duration: animationDuration }, { opacity: 1 }, { opacity: 0 })
          .then(() => _remove($play))

        const $pause = newPause($video, $mainButton)
        _append($mainButton, $pause)
        _animateStyle($pause, { duration: animationDuration }, { opacity: 0 }, { opacity: 1 })
      },
    },
  })

  return $play
}

const newPause = ($video, $mainButton) => {
  const $pause = pause({
    events: {
      click: async () => {
        $video.pause()

        _animateStyle($pause, { duration: animationDuration }, { opacity: 1 }, { opacity: 0 })
          .then(() => _remove($pause))

        const $play = newPlay($video, $mainButton)
        _append($mainButton, $play)
        _animateStyle($play, { duration: animationDuration }, { opacity: 0 }, { opacity: 1 })
      },
    },
  })

  return $pause
}

const collection = _collection($youtubeSongs, {
  create: i => {
    const $title = title()
    const $source = source()
    const $video = video({ append: $source })
    const $mainButton = mainButton()
    const $play = newPlay($video, $mainButton)
    _append($mainButton, $play)
    const $player = player({ append: [$video, $mainButton] })
    const $thumbnail = thumbnail()
    // const $player = player({ append: $thumbnail })

    return {
      $item: item({
        coords: { y: i * itemHeight },
        animateStyle: [{ duration: animationDuration }, { opacity: 0 }, { opacity: 1 }],
        append: [$player, $title],
      }),
      $player,
      $thumbnail,
      $title,
      $video,
      $source,
    }
  },
  update: {
    id: ({ $source }, value) => _attributes($source, { src: `http://localhost:3001/youtube/mp3/${value}` }),
    thumbnail: ({ $thumbnail }, value) => _attributes($thumbnail, { src: value }),
    title: ({ $title }, value) => _text($title, value),
  },
  move: ({ $item }, { previousIndex, nextIndex }) =>
    _animateCoords($item, { duration: animationDuration }, { y: previousIndex * itemHeight }, { y: nextIndex * itemHeight }),
  remove: async ({ $item }) => await _animateStyle($item, { duration: animationDuration }, { opacity: 1 }, { opacity: 0 }),
})

collection.on(separators)

export default collection
