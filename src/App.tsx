import { Toaster } from 'react-hot-toast'
import { FormCertificate } from './components/app/form-certificate'
import { Header } from './components/ui'

function App () {
  return (
    <div className='relative overflow-hidden inset-0 main min-h-screen'>
      <Toaster />
      <Header />
      <FormCertificate />
    </div>
  )
}

export default App
