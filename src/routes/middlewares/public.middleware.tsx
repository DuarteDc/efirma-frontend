import { useContext, type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '@/context/auth'

interface Props {
  children: ReactNode | Array<ReactNode>
}

export const PublicMiddleware = ({ children }: Props) => {
  const { user } = useContext(AuthContext)

  return user ? <Navigate to={'/sign'} replace /> : children
}
