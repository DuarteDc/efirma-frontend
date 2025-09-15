import { FormCertificate } from './components/app/form-certificate'
import { Header } from './components/ui'
import { AuthProvider } from './context/auth'

function App () {
  return (
    <AuthProvider>
      <div className='relative overflow-hidden inset-0 main min-h-screen'>
        <Header />
        <FormCertificate />
      </div>
    </AuthProvider>
  )
}

export default App
