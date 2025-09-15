import { useReducer, type ReactNode } from 'react'
import { AuthContext } from './auth.context'
import { authReducer, type AuthState } from './auth.reducer'

interface Props {
  children: ReactNode
}

const initialState: AuthState = {
  user: null
}

export const AuthProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}
