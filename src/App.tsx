import { MainLayout } from './components/layouts'
import { AuthProvider } from './context/auth'
import { MainRouter } from './routes/main.router'

function App () {
  return (
    <AuthProvider>
      {/* <AuthMiddleware> */}
      <MainLayout>
        <MainRouter />
      </MainLayout>
      {/* </AuthMiddleware> */}
    </AuthProvider>
  )
}

export default App
