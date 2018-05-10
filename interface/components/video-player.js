import _ from '_'
import __ from '__'
// import Loader from './loader'
import coords from 'store/coords'
import animations from 'utils/animations'
import './video-player.sass'

export default class VideoPlayer {
  store = new __.Store(
    {
      loading: false,
      thumbnailUrl: null,
      showThumbnail: false,
      play: false,
      currentTime: 0,
      playbackHover: false
    },
    {
      thumbnailUrl: () => this.$thumbnail.set({ href: this.thumbnailUrl }),
      showThumbnail: () => this.showHideThumbnail(this.showThumbnail),
      play: () => {
        const { $video, emit, play, showThumbnail } = this

        if (play) {
          const updater = () => {
            emit('currentTime', $video.currentTime)

            if (play) requestAnimationFrame(updater)
          }

          updater()

          $video.play()

          if (showThumbnail) emit('showThumbnail', false)
        } else $video.pause()
      },
      source: () => _.attributes(this.$source, { src: this.source })
    }
  )

  $thumbnail = _({
    svg: 'image',
    class: 'thumbnail',
    coords: coords.item.videoPlayer.thumbnail
  })
  $source = _({
    el: 'source',
    class: 'source',
    type: 'video/mp4'
  })
  $video = _({
    el: 'video',
    class: 'video',
    controlslist: 'nodownload',
    coords: coords.item.videoPlayer.video,
    loadstart: () => this.emit('loading', true),
    canplay: () => this.emit('loading', false),
    append: this.$source
  })
  // $loader = new Loader()
  $videoWrapper = _({
    svg: 'foreignObject',
    coords: coords.videoWrapper,
    append: [this.$video]
  })
  $videoPlayer = _({
    svg: true,
    mouseenter: () => this.emit('playbackHover', true),
    mouseleave: () => this.emit('playbackHover', false),
    click: () => this.emit('play', !this.play),
    append: [this.$thumbnail, /*this.loader.$loader,*/ this.$videoWrapper]
  })

  showHideThumbnail = animations.showHide(this.$thumbnail)
}
