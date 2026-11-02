import { InjectionToken } from '@angular/core';
import { AppEnvironment } from '../../environments/environment.model';
import { environment } from '../../environments/environment';

/** Inject config instead of importing `environment` everywhere — makes it overridable in tests. */
export const APP_ENV = new InjectionToken<AppEnvironment>('APP_ENV', {
  providedIn: 'root',
  factory: () => environment,
});
