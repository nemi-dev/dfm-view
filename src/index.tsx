import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'

import styled from 'styled-components'


const root = document.getElementById('root') as HTMLElement
const version = document.querySelector('footer .about .version') as HTMLElement
version.innerText = APP_VERSION



const MainStyle = styled.main`
  width: 80vw;
  margin: auto;

  min-width: calc(100vw - 2rem);

  h1 {
    margin: 0;
  }
`

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <MainStyle>
      <h1>던파모바일 스탯계산기!!!</h1>
      
    </MainStyle>
  </React.StrictMode>
)
