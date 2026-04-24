import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from "react-redux"
import './index.css'
import App from './App.jsx'
import ErrorBoundary from "./components/ErrorBoundary"
import { store } from "./redux/store"
import { ToastProvider } from "./components/Toast"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ErrorBoundary>
        <ToastProvider>
          <App />
        </ToastProvider>
      </ErrorBoundary>
    </Provider>
  </StrictMode>
)
