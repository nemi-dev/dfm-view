import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import Modal from 'react-modal'
import App from './comps/App'
import store from './feats/store'
import { Provider as StoreProvider } from 'react-redux'

import { persistStore } from "redux-persist"
import { PersistGate } from "redux-persist/lib/integration/react"

import feather from "feather-icons"

const root = document.getElementById('root') as HTMLElement
const version = document.querySelector('footer .about .version') as HTMLElement
version.append(APP_VERSION)

const persistor = persistStore(store)
Modal.setAppElement(root)


ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <StoreProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </StoreProvider>
  </React.StrictMode>
)

const github = document.getElementById('github') as HTMLElement

github.innerHTML = feather.icons.github.toSvg()
