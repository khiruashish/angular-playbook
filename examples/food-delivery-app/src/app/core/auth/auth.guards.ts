import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { Role } from '../models/models';
import { AuthService } from './auth.service';

/** Authentication: is anyone logged in? Redirects to /login with a returnUrl. */
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  if (auth.isAuthenticated()) return true;
  return inject(Router).createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};

/** Authorization: does the user hold one of the roles? Used as canMatch so the lazy chunk is never downloaded. */
export const roleGuard =
  (...roles: Role[]): CanMatchFn =>
  () => {
    const auth = inject(AuthService);
    if (!auth.isAuthenticated()) return inject(Router).createUrlTree(['/login']);
    return auth.hasAnyRole(...roles) ? true : inject(Router).createUrlTree(['/forbidden']);
  };
