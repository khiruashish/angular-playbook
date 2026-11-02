import { AppEnvironment } from './environment.model';

export const environment: AppEnvironment = {
  name: 'prod',
  production: true,
  apiBaseUrl: 'https://api.food.example.com',
  useMockApi: false,
  auth: { issuer: 'https://auth.food.example.com/realms/food', clientId: 'food-web' },
  featureFlags: { liveTracking: true, newCheckout: false },
  logLevel: 'error',
};
