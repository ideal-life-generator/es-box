export default {
  state: {
    leftPanelX: 0,
    leftPanelY: 0,
    resultsX: 150,
    resultsY: 0,
  },
  getters: {
    size: state => console.log(state) || state
  },
}
