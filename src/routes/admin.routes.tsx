import { Route, Routes } from 'react-router-dom'
import { SignPage } from '@/pages'

export const AdminRoutes = () => {
  return (
    <Routes>
      <Route path='/*' element={<SignPage />} />
    </Routes>
  )
}
