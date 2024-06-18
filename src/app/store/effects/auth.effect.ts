import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import * as AuthActions from '../actions/auth.action';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of, interval } from 'rxjs';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ email, password }) =>
        this.authService.login(email, password).pipe(
          map(({ user, accessToken, refreshToken }) => {
            sessionStorage.setItem('accessToken', accessToken);
            sessionStorage.setItem('refreshToken', refreshToken);
            return AuthActions.loginSuccess({ user });
          }),
          catchError((error) =>
            of(AuthActions.loginFailure({ error: error.error }))
          )
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        map(() => {
          this.router.navigate(['/video']);
          this.startTokenRefresh();
        })
      ),
    { dispatch: false }
  );

  refreshToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshToken),
      switchMap(() => {
        const refreshToken = sessionStorage.getItem('refreshToken');
        if (refreshToken) {
          return this.authService.refreshToken(refreshToken).pipe(
            map((response) => {
              const accessToken = response;
              sessionStorage.setItem('accessToken', accessToken);
              return AuthActions.refreshTokenSuccess({ accessToken });
            }),
            catchError((error) =>
              of(
                AuthActions.refreshTokenFailure({ error: error.error.message })
              )
            )
          );
        } else {
          return of(
            AuthActions.refreshTokenFailure({ error: 'Refresh token is null' })
          );
        }
      })
    )
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router,
    private store: Store
  ) {}

  // auto refresh token per 50 minutes
  startTokenRefresh() {
    interval(50 * 60 * 1000).subscribe(() => {
      this.store.dispatch(AuthActions.refreshToken());
    });
  }
}
