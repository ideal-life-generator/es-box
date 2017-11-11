import React, { Component } from 'react'
import { element } from 'prop-types'

const styles = {
  app: {
    flexGrow: 1,
    backgroundColor: 'lightblue',
  },
}

export default class App extends Component {
  static propTypes = {
    children: element.isRequired,
  }

  render() {
    const {
      props: { children },
    } = this

    return (
      <div style={styles.app}>
        App
        {children}
      </div>
    )
  }
}
