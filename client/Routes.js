import React from 'react'
import { Switch, Route } from 'react-router-dom'
import App from './containers/App'
import NotFound from './containers/NotFound'

export default () => (
  <Switch>
    <Route
      path="/"
      exact
      render={() => (
        <App />
      )}
    />
    <Route render={() => (<NotFound />)} />
  </Switch>
)
