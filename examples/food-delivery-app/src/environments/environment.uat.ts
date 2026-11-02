import { AppEnvironment } from './environment.model';

export const environment: AppEnvironment = {
  name: 'uat',
  production: true,
  apiBaseUrl: 'https://api.uat.food.example.com',
  useMockApi: false,
  auth: { issuer: 'https://auth.uat.food.example.com/realms/food', clientId: 'food-web-uat' },
  featureFlags: { liveTracking: true, newCheckout: false },
  logLevel: 'warn',
};
