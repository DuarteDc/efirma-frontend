import type { User } from "@/types/login.definition";

export type AuthActionType =
  | { type: "ACTION-LOGIN"; payload: User }
  | { type: "AUTH-REFRESH"; payload: User };
export interface AuthState {
  user: User | null;
}

export const authReducer = (state: AuthState, action: AuthActionType) => {
  switch (action.type) {
    case "ACTION-LOGIN":
      return {
        ...state,
        user: action.payload,
      };

    case "AUTH-REFRESH":
      return {
        ...state,
        user: action.payload,
      };

    default:
      return state;
  }
};
