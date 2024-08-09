import { User } from "../interface/user.model";


export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
};
