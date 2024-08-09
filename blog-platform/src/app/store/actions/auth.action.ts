import { createAction, props } from '@ngrx/store';
import { User } from '../interface/user.model';

export const login = createAction(
    '[Auth] Login',
    props<{ user: { email: string, password: string } }>()
  );
  
  export const logout = createAction('[Auth] Logout');
  
  export const loginSuccess = createAction(
    '[Auth] Login Success',
    props<{ user: User }>()
  );
  
  export const loginFailure = createAction(
    '[Auth] Login Failure',
    props<{ error: any }>()
  );
