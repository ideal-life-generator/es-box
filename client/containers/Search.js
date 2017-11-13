import React, { Component } from 'react'
import { string, func } from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import radium from 'radium'
import ClearIcon from '../components/Icons/Clear'
import * as searchActions from '../reducers/search'

const searchHeight = 39
const searchBorderWidth = 2

const style = {
  search: {
    display: 'flex',
    height: searchHeight,
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: searchHeight / 2,
    boxSizing: 'border-box',
  },
  input: {
    flexGrow: 1,
    paddingLeft: 13,
    paddingRight: 3,
    fontSize: 18,
    color: 'black',
  },
  clear: {
    marginRight: 2.5,
    width: (searchHeight - (searchBorderWidth * 2)),
    borderRadius: '50%',
    fill: 'black',
    cursor: 'pointer',
    ':hover': {
      fill: 'maroon',
    },
  },
}

@connect(({
  search: { value },
}) => ({ value }), dispatch => bindActionCreators({
  set: searchActions.set,
  clear: searchActions.clear,
}, dispatch))

@radium

export default class Search extends Component {
  static propTypes = {
    value: string.isRequired,
    set: func.isRequired,
    clear: func.isRequired,
  }

  onChange = ({ target: { value } }) => {
    const {
      props: { set },
    } = this

    set(value)
  }

  onClear = () => {
    const {
      props: { clear },
    } = this

    clear()
  }

  render() {
    const {
      onChange,
      onClear,
      props: {
        value,
      },
    } = this

    return (
      <div style={style.search}>
        <input
          style={style.input}
          value={value}
          onChange={onChange}
          placeholder="Search"
        />
        {value && (
          <button
            onClick={onClear}
            style={style.clear}
          >
            <ClearIcon size={10.5} />
          </button>
        )}
      </div>
    )
  }
}
