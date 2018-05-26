const { innerWidth, innerHeight } = window

const calculateAppWidth = () => innerWidth
const calculateAppHeight = () => innerHeight
const calculateTopWidth = ({ appWidth }) => appWidth
const calculateLeftY = ({ topHeight }) => topHeight
const calculateLeftHeight = ({ appHeight, leftY, topY, topHeight }) => appHeight - topY - topHeight - leftY
const calculateRightY = ({ topHeight }) => topHeight
const calculateRightHeight = ({ appHeight, rightY, topY, topHeight }) => appHeight - topY - topHeight - rightY
const calculateRightX = ({ appWidth, rightWidth }) => appWidth - rightWidth
const calculateMainX = ({ leftX, leftWidth }) => leftX + leftWidth
const calculateMainY = ({ topY, topHeight }) => topY + topHeight
const calculateMainWidth = ({ appWidth, mainX, rightWidth }) => appWidth - mainX - rightWidth

const appWidth = calculateAppWidth()
const appHeight = calculateAppHeight()
const topY = 0
const topX = 0
const topWidth = calculateTopWidth({ appWidth })
const topHeight = 0
const leftX = 0
const leftY = calculateLeftY({ topHeight })
const leftWidth = 190
const leftHeight = calculateLeftHeight({ appHeight, leftY, topY, topHeight })
const rightY = calculateRightY({ topHeight })
const rightWidth = 70
const rightHeight = calculateRightHeight({ appHeight, rightY, topY, topHeight })
const rightX = calculateRightX({ appWidth, rightWidth })
const mainX = calculateMainX({ leftX, leftWidth })
const mainY = calculateMainY({ topY, topHeight })
const mainWidth = calculateMainWidth({ appWidth, mainX, rightWidth })
const resultsX = 0
const resultsY = 50

export default {
  state: {
    appWidth,
    appHeight,
    topX,
    topY,
    topWidth,
    topHeight,
    leftX,
    leftY,
    leftWidth,
    leftHeight,
    rightWidth,
    rightHeight,
    rightY,
    rightX,
    mainX,
    mainY,
    mainWidth,
    resultsX,
    resultsY,
  },
  getters: {
    size: state => console.log(state) || state
  },
}
