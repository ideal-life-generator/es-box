import React, { Component } from 'react'
import { string, func, shape } from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import injectSheet from 'react-jss'
import * as exampleActions from '../reducers/example'

const styles = {
  app: {
    flexGrow: 1,
  },
}

@injectSheet(styles)

@connect(({
  example: { name },
}) => ({ name }), dispatch => bindActionCreators({
  setName: exampleActions.setName,
}, dispatch))

export default class App extends Component {
  static propTypes = {
    classes: shape({
      app: string.isRequired,
    }).isRequired,
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
      props: {
        classes,
        name,
      },
    } = this;

    return (
      <div className={classes.app}>
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
