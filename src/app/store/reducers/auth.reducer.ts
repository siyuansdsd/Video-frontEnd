import { createReducer, on } from '@ngrx/store';
import * as AuthActions from '../actions/auth.action';
import { User } from '../../interface/user';

export interface AuthState {
  user: User | null;
  error: Error | null;
  login: boolean;
}

export const initialState: AuthState = {
  user: null,
  error: null,
  login: false,
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.loginSuccess, (state, { user }) => ({
    ...state,
    user,
    error: null,
    login: true,
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    error,
    login: false,
  }))
);
