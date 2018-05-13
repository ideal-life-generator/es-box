import __ from '__'

const itemWidth = 1236
const itemHeight = 145
const separatorWidth = itemWidth
const separatorHeight = 1
const separatorTop = itemHeight - separatorHeight
const contentTop = 20
const contentWidth = itemWidth
const contentHeight = itemHeight - contentTop * 2
const infoHeight = contentHeight
const playerHeight = contentHeight
const playerWidth = playerHeight / 0.565
const loaderSize = 25
const loaderLeft = (playerWidth - loaderSize) / 2
const loaderTop = (playerHeight - loaderSize) / 2
const thumbnailHeight = 90
const infoPaddingLeft = 20
const infoLeft = playerWidth + infoPaddingLeft
const infoWidth = itemWidth - infoLeft
const playbackWidth = 18
const playbackHeight = 20.36
const titleTop = 27
const titleHeight = 20
const progressHeight = 1
const progressTop = infoHeight - progressHeight
const progressTimeHeight = 20

export default new __.Store(
  {
    width: 1236,
    height: 145,
    separator: {
      height: 1,
      x1: 0,
      y1: separatorTop,
      x2: separatorWidth,
      y2: separatorTop
    },
    content: {
      y: contentTop
    },
    videoPlayer: {
      width: playerWidth,
      height: playerHeight
    }
  },
  {
    width: () => {
      const { item } = this

      this.separator.x2 = item.width
    },
    height: () => {
      const { item, separator } = this

      this.separator.y1 = item.height - separator.height
      this.separator.y2 = this.separator.y1
    }
  }
)
