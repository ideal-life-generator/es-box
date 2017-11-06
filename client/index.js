import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import store from './store'
import App from './containers/App'

const $app = document.getElementById('app')

const renderApp = NextApp => render(
  <AppContainer>
    <Provider store={store}>
      <Router>
        <NextApp />
      </Router>
    </Provider>
  </AppContainer>,
  $app,
)

renderApp(App)

if (module.hot) {
  module.hot.accept('./containers/App', () => renderApp(App))
}
