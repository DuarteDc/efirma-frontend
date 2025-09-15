import { Route, Routes } from 'react-router'
import { LoginPage } from '../modules/auth/pages/login.page'
import {
  AuthMiddleware,
  PrivateMiddleware,
  PublicMiddleware
} from './middlewares'
import { AdminRoutes } from './admin.routes'
import { NotFound } from '@/modules/core/pages'
import { QrDataPage } from '@/modules/common/pages/qr-data.page'

export const MainRouter = () => {
  return (
    <Routes>
      <Route path='/verify-user/:id' index element={<QrDataPage />} />
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
        path='/admin/*'
        index
        element={
          <AuthMiddleware>
            <PrivateMiddleware>
              <AdminRoutes />
            </PrivateMiddleware>
          </AuthMiddleware>
        }
      />
      <Route path='*' index element={<NotFound />} />
    </Routes>
  )
}
