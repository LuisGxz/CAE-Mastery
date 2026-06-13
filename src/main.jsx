import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tokens.css'   // design tokens (oklch)
import './styles/base.css'     // reset + design-system components
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
