import type { ReactNode } from 'react'
import { Navigate } from 'react-router'
import { useAuthStore } from '../../stores/auth/auth.store'

interface Props {
  children: ReactNode | Array<ReactNode>
}

export const PrivateMiddleware = ({ children }: Props) => {
  const logged = useAuthStore(state => state.logged)

  return logged ? children : <Navigate to='/' replace />
}
