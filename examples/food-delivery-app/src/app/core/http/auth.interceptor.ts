import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { APP_ENV } from '../config';
import { AuthService } from '../auth/auth.service';

/** Attaches the bearer token — only to our own API, never to third-party URLs (token leakage). */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const env = inject(APP_ENV);
  const token = inject(AuthService).token();
  if (!token || !req.url.startsWith(env.apiBaseUrl)) return next(req);
  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};
