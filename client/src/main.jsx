import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'//createRoot → React app mount karega
import './index.css'
import App from './App.jsx'//App → main component
import {BrowserRouter} from 'react-router-dom'//BrowserRouter → routing enable
import {AppContextProvider} from './context/AppContext.jsx'//AppContextProvider → global state

createRoot(document.getElementById('root')).render(//🔹 Root Mount
  <BrowserRouter>
  <AppContextProvider>
    <App />
  </AppContextProvider>
  </BrowserRouter>
)
// 🧠 Order (IMPORTANT)
// 1️⃣ BrowserRouter 👉 routing system ON

// 2️⃣ AppContextProvider 👉 global data available

// 3️⃣ App 👉 actual UI

// 💥 Flow:
// User → URL
// → Router handle
// → App render
// → Context data available

// StrictMode
// <StrictMode>
// 👉 dev mode tool
// 💡 what did?
// checks double render
// detect bugs
// give warnings

// 🧠 FULL FLOW (START TO END)
// Browser load → main.jsx
// → React mount
// → Router setup
// → Context setup
// → App.jsx
// → Login / Chat UI