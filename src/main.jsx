import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { HelmetProvider } from 'react-helmet-async'; // <--- IMPORTANTE

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider> {/* <--- O APP TEM QUE ESTAR DENTRO DISSO */}
      <App />
    </HelmetProvider>
  </React.StrictMode>,
)