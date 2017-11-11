import React from 'react'
import { hydrate } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import createStore from './store'
import Routes from './Routes'

const $app = document.getElementById('app')

const { PRELOADED_STATE } = window

delete window.PRELOADED_STATE

const store = createStore(PRELOADED_STATE)

const renderApp = NextRoutes => hydrate(
  <AppContainer warnings={false}>
    <Provider store={store}>
      <BrowserRouter>
        <NextRoutes />
      </BrowserRouter>
    </Provider>
  </AppContainer>,
  $app,
)

renderApp(Routes)

if (module.hot) {
  module.hot.accept('./Routes', async () => renderApp((await import('./Routes')).default))
}
