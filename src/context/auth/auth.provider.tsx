import { useReducer, type ReactNode } from 'react'
import { AuthContext } from './auth.context'
import { authReducer, type AuthState } from './auth.reducer'
import type { User } from '@/types/login.definition'

interface Props {
  children: ReactNode
}

const initialState: AuthState = {
  user: null
}

export const AuthProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  const handleLogin = (user: User) => {
    dispatch({ type: 'ACTION-LOGIN', payload: user })
  }

  const handleRefresToken = (user: User) => {
    dispatch({ type: 'AUTH-REFRESH', payload: user })
  }

  return (
    <AuthContext.Provider
      value={{ ...state, dispatch, handleLogin, handleRefresToken }}
    >
      {children}
    </AuthContext.Provider>
  )
}
