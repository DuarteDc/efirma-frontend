import { Route, Routes } from 'react-router'

import { UserRoutes } from '../modules/users/routes/user.routes'
import { ScheduleRoutes } from '../modules/schedules/routes/schedule.routes'
import { ParkingRoutes } from '../modules/parking-lot/routes/parking.routes'
import { AdminLayout } from '../modules/core/components/layouts'
import { useAuthStore } from '../stores/auth/auth.store'
import { BuildingRoutes } from '@/modules/buildings/routes/building.routes'

export const AdminRoutes = () => {
  const user = useAuthStore(state => state.user)

  return (
    <Routes>
      {user?.typeUser !== 'OPERADOR' && (
        <Route
          path='/*'
          element={
            <AdminLayout
              headerText='Bienvenido de vuelta'
              title={`${user?.name} ${user?.surname}`}
              subtitle='Desde este espacio podras administrar tus citas de forma fácil y rápida'
            >
              <ScheduleRoutes />
            </AdminLayout>
          }
        />
      )}

      {user?.typeUser === 'ADMIN' && (
        <>
          <Route
            path='/users/*'
            element={
              <AdminLayout
                title={`Usuarios`}
                subtitle='En esta vista podras administar todos tus usuarios '
              >
                <UserRoutes />
              </AdminLayout>
            }
          />
          <Route
            path='/buildings/*'
            element={
              <AdminLayout
                title={`Edificios`}
                subtitle='En esta vista podras administar todos tus edificios '
              >
                <BuildingRoutes />
              </AdminLayout>
            }
          />
        </>
      )}
      {(user?.typeUser === 'ADMIN' || user?.typeUser === 'OPERADOR') && (
        <Route
          path='/parking/*'
          element={
            <AdminLayout
              title={`Administración de Estacionamientos`}
              subtitle='En esta vista podras administar todos tus usuarios '
            >
              <ParkingRoutes />
            </AdminLayout>
          }
        />
      )}
      {/* <Route path='*' index element={<NotFound />} /> */}
    </Routes>
  )
}
