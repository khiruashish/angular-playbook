import { AppEnvironment } from './environment.model';

/** Local development (ng serve). Replaced at build time via fileReplacements in angular.json. */
export const environment: AppEnvironment = {
  name: 'dev',
  production: false,
  apiBaseUrl: '/api',
  useMockApi: true,
  auth: { issuer: 'http://localhost:8080/realms/food', clientId: 'food-web-dev' },
  featureFlags: { liveTracking: true, newCheckout: true },
  logLevel: 'debug',
};
