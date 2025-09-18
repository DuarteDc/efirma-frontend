import { Route, Routes } from 'react-router-dom'
import {
  AuthMiddleware,
  PrivateMiddleware,
  PublicMiddleware
} from './middlewares'
import { LoginPage } from '@/pages/login.page'
import { AdminRoutes } from './admin.routes'

export const MainRouter = () => {
  return (
    <Routes>
      <Route
        path='/'
        index
        element={
          <AuthMiddleware>
            <PublicMiddleware>
              <LoginPage />
            </PublicMiddleware>
          </AuthMiddleware>
        }
      />
      <Route
        path='/sign/*'
        index
        element={
          <AuthMiddleware>
            <PrivateMiddleware>
              <AdminRoutes />
            </PrivateMiddleware>
          </AuthMiddleware>
        }
      />
      {/* <Route path='*' index element={<NotFound />} /> */}
    </Routes>
  )
}
