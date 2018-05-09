// import { events, append } from 'interface'
// import $logo from './components/logo'
// import { $main } from 'containers/main'
import VideoPlayer from 'components/video-player'
import 'styles/index.sass'

const videoPlayer = new VideoPlayer()

console.log(videoPlayer)

videoPlayer.emit('showThumbnail', true)

console.log(videoPlayer)

// events(document, {
//   DOMContentLoaded() {
//     // const { body: $body } = document

//     // append($body, [$main])
//   }
// })
