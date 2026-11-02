import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, retry, throwError, timer } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { NotificationService } from '../../shared/ui/notification.service';

/** Central error handling: retry idempotent GETs on 5xx/network, logout on 401, toast on others. */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const notify = inject(NotificationService);

  return next(req).pipe(
    retry({
      count: req.method === 'GET' ? 2 : 0,
      delay: (err: HttpErrorResponse, attempt) =>
        err.status === 0 || err.status >= 500 ? timer(attempt * 300) : throwError(() => err),
    }),
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        auth.logout();
        notify.show('Session expired — please sign in again', 'error');
      } else if (err.status === 403) {
        notify.show('You are not allowed to do that', 'error');
      } else {
        // RFC 9457 ProblemDetail: { title, detail, status }
        notify.show(err.error?.detail ?? err.error?.title ?? 'Something went wrong', 'error');
      }
      return throwError(() => err);
    }),
  );
};
