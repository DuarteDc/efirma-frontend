import type { User } from "@/types/login.definition";

export type AuthActionType = { type: "ACTION-LOGIN"; payload: User };
export interface AuthState {
  user: User | null;
}

export const authReducer = (action: AuthActionType, state: AuthState) => {
  switch (action.type) {
    case "ACTION-LOGIN":
      return {
        ...state,
        user: action.payload,
      };

    default:
      return state;
  }
};
