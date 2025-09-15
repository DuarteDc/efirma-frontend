import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { LoginPage } from './pages/login.page.tsx'
import { Toaster } from 'sonner'
import { AuthProvider } from './context/auth/auth.provider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Toaster position='top-center' />
        <LoginPage />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
