import React from 'react'
import ReactDOM from 'react-dom/client'
import Modal from 'react-modal'
import App from './comps/App'
import store from './feats/store'
import { Provider } from 'react-redux'
import './index.css'

const root = document.getElementById('root') as HTMLElement
const version = document.querySelector('footer .about .version') as HTMLElement
version.append(APP_VERSION)

Modal.setAppElement(root)

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)
