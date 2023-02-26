import React from 'react'
import ReactDOM from 'react-dom/client'
import Modal from 'react-modal'
import App from './comps/App'
import store from './feats/store'
import { Provider } from 'react-redux'
import './index.css'

const root = document.getElementById('root') as HTMLElement

Modal.setAppElement(root)

ReactDOM.createRoot(root).render(

  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)
