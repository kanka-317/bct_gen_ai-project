import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// "Fix" for harmless browser extension errors (Chrome/Edge)
// This suppresses the "message channel closed before a response was received" warning
window.addEventListener('error', (e) => {
  if (e.message === 'ResizeObserver loop completed with undelivered notifications.' ||
      e.message === 'ResizeObserver loop limit exceeded' ||
      e.message.includes('message channel closed before a response was received')) {
    e.stopImmediatePropagation();
    const resizeObserverErrDiv = document.getElementById('webpack-dev-server-client-overlay-div');
    if (resizeObserverErrDiv) resizeObserverErrDiv.style.display = 'none';
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
