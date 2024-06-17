import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from '../reducers/auth.reducer';

const getAuthState = createFeatureSelector<AuthState>('auth');

export const getUser = createSelector(
  getAuthState,
  (state: AuthState) => state.user
);

export const getUserId = createSelector(getAuthState, (state: AuthState) =>
  state.user ? state.user.id : null
);

export const getLogin = createSelector(
  getAuthState,
  (state: AuthState) => state.login
);

export const getError = createSelector(
  getAuthState,
  (state: AuthState) => state.error
);
