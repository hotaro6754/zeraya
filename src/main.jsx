import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { FirebaseProvider } from './hooks/useFirebase';

ReactDOM.createRoot(document.getElementById('root')).render(
  <HashRouter>
    <FirebaseProvider>
      <App />
    </FirebaseProvider>
  </HashRouter>
)
