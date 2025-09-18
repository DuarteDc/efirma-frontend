import { useContext, type ReactNode } from 'react'

import { useFetcher } from '@/hooks/use-fetcher'
import { AuthRepository } from '@/repositories/auth.repository'
import { AuthContext } from '@/context/auth'

interface Props {
  children: ReactNode | Array<ReactNode>
}

const authRepository = new AuthRepository()

export const AuthMiddleware = ({ children }: Props) => {
  const { handleLogin } = useContext(AuthContext)

  const { isLoading } = useFetcher(
    '/api/v1/auth/refresh',
    authRepository.getSession.bind(authRepository),
    handleLogin
  )

  if (isLoading) {
    return <></>
  }

  return children
}
