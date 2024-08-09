import { User } from './../interface/user.model';
import { createReducer, on } from "@ngrx/store";
import { Action } from "rxjs/internal/scheduler/Action"
import { initialAuthState } from "../state/auth.state";
import { loginSuccess, logout } from "../actions/auth.action";

const _authReducer = createReducer(
    initialAuthState,
    on(loginSuccess, (state, {user} ) => ({
      ...state,
      user,
      isAuthenticated: true,
    })),
    on(logout, state => ({
      ...state,
      user: null,
      isAuthenticated: false,
    }))
  );

export function authReducer(state: any, action: any) {
    return _authReducer(state, action);
  }