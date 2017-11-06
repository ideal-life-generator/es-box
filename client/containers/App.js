import React, { Component } from 'react'
import { string, func } from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as exampleActions from '../reducers/example'

const styles = {
  app: {
    flexGrow: 1,
    backgroundColor: 'lightblue',
  },
}

@connect(({
  example: { name },
}) => ({ name }), dispatch => bindActionCreators({
  setName: exampleActions.setName,
}, dispatch))

export default class App extends Component {
  static propTypes = {
    name: string.isRequired,
    setName: func.isRequired,
  }

  onNameChange = ({ target: { value: name } }) => {
    const {
      props: { setName },
    } = this;

    setName(name)
  }

  render() {
    const {
      onNameChange,
      props: { name },
    } = this;

    return (
      <div style={styles.app}>
        <div>
          <input
            value={name}
            onChange={onNameChange}
            placeholder="Name"
          />
        </div>
        <div>
          {`Hi ${name}`}
        </div>
      </div>
    )
  }
}
