import React, { Component } from 'react'
import radium from 'radium'
import Search from './Search'

const styles = {
  app: {
    flexGrow: 1,
    backgroundColor: 'lightblue',
    ':hover': {
      backgroundColor: 'lightgreen',
    },
  },
  main: {
    marginTop: 65,
    marginLeft: 150,
    marginRight: 150,
  },
  searchContainer: {},
  content: {},
  list: {
    width: 375,
    margin: 15,
    padding: 15,
    backgroundColor: 'lavenderblush',
  },
}

@radium

export default class App extends Component {
  render() {
    return (
      <div style={styles.app}>
        <main style={styles.main}>
          <aside style={styles.searchContainer}>
            <Search />
          </aside>
          <section style={styles.content}>
            <ul style={styles.list}>
              <li>
                Song prototype
              </li>
            </ul>
          </section>
        </main>
      </div>
    )
  }
}
