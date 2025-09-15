import { createContext, type Dispatch } from "react";
import type { AuthActionType, AuthState } from "./auth.reducer";

interface AuthContextProps extends AuthState {
  dispatch: Dispatch<AuthActionType>;
}
export const AuthContext = createContext({} as AuthContextProps);
