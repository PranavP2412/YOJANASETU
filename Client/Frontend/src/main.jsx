import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="1021074490384-04n0oepn8bg165ni6embhn56r05nusb9.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>,
)
