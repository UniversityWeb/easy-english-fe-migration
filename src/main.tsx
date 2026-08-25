import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import App from './App'
import GlobalStyles from './themes/GlobalStyles'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalStyles>
      <App />
    </GlobalStyles>
  </StrictMode>,
)
