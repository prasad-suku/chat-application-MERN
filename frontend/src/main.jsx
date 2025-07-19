import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from "react-router-dom"
import App from './App.jsx'
import  "./index.css"
import { ChatProvider } from '../context/ChatContext.jsx'
import { AuthProvider } from '../context/Authcontext.jsx'
createRoot(document.getElementById('root')).render(
 
    <BrowserRouter>
    <AuthProvider> 
        <ChatProvider>
           <App />
        </ChatProvider>
    </AuthProvider>
    </BrowserRouter>
 
)
