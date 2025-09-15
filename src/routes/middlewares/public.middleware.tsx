import type { ReactNode } from 'react'
import { Navigate } from 'react-router'
import { useAuthStore } from '../../stores/auth/auth.store'

interface Props {
  children: ReactNode | Array<ReactNode>
}

export const PublicMiddleware = ({ children }: Props) => {
  const logged = useAuthStore(state => state.logged)
  const user = useAuthStore(state => state.user)

  return logged ? (
    <Navigate
      to={user?.typeUser === 'OPERADOR' ? '/admin/parking' : '/admin'}
      replace
    />
  ) : (
    children
  )
}
