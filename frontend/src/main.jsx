// main.jsx — React's front door
// ReactDOM.createRoot mounts your entire app into the <div id="root"> in index.html
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>   {/* StrictMode = extra warnings in dev. Good habit. */}
    <App />
  </React.StrictMode>
)