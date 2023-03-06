import React from 'react'
import ReactDOM from 'react-dom/client'
import Modal from 'react-modal'
import App from './comps/App'
import store from './feats/store'
import { Provider } from 'react-redux'

// import { persistStore } from "redux-persist"
// import { PersistGate } from "redux-persist/lib/integration/react"
import './index.css'

const root = document.getElementById('root') as HTMLElement
const version = document.querySelector('footer .about .version') as HTMLElement
version.append(APP_VERSION)


// const persistor = persistStore(store)
Modal.setAppElement(root)

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* <PersistGate loading={null} persistor={persistor}> */}
        <App />
      {/* </PersistGate> */}
    </Provider>
  </React.StrictMode>,
)
