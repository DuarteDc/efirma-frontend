import type { ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../modules/auth/hooks/use-auth'
import { LoaderScreen } from '../../modules/core/components/atoms'

interface Props {
  children: ReactNode | Array<ReactNode>
}

export const AuthMiddleware = ({ children }: Props) => {
  const { startRefreshToken } = useAuth()

  const { isLoading } = useQuery({
    queryKey: ['/refersh'],
    queryFn: startRefreshToken,
    refetchIntervalInBackground: true,
    refetchInterval: 1800000,
    refetchOnWindowFocus: false
  })

  if (isLoading) {
    return <LoaderScreen />
  }

  return children
}
