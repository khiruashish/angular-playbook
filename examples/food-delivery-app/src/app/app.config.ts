import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';
import { authInterceptor } from './core/http/auth.interceptor';
import { errorInterceptor } from './core/http/error.interceptor';
import { idempotencyInterceptor } from './core/http/idempotency.interceptor';
import { loadingInterceptor } from './core/http/loading.interceptor';
import { mockApiInterceptor } from './core/mock/mock-api.interceptor';

/**
 * Angular 22 apps are zoneless by default (no zone.js) and components default to OnPush.
 * Interceptor order matters: they run top-to-bottom on the request, bottom-to-top on the response.
 * The mock backend is last so it sees the final request (with auth + idempotency headers).
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding(), withViewTransitions(), withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    provideHttpClient(
      withFetch(),
      withInterceptors([loadingInterceptor, authInterceptor, idempotencyInterceptor, errorInterceptor, mockApiInterceptor]),
    ),
  ],
};
