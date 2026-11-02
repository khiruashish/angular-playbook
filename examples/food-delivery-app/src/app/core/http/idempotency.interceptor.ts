import { HttpInterceptorFn } from '@angular/common/http';

/** Mutating requests carry an Idempotency-Key so a retried "Place order" never double-charges. */
export const idempotencyInterceptor: HttpInterceptorFn = (req, next) => {
  if (!['POST', 'PUT', 'PATCH'].includes(req.method) || req.headers.has('Idempotency-Key')) {
    return next(req);
  }
  return next(req.clone({ setHeaders: { 'Idempotency-Key': crypto.randomUUID() } }));
};
