import { createContext, type Dispatch } from "react";
import type { AuthActionType, AuthState } from "./auth.reducer";
import type { User } from "@/types/login.definition";

interface AuthContextProps extends AuthState {
  dispatch: Dispatch<AuthActionType>;
  handleLogin: (user: User) => void;
}
export const AuthContext = createContext({} as AuthContextProps);
