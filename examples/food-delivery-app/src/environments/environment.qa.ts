import { AppEnvironment } from './environment.model';

export const environment: AppEnvironment = {
  name: 'qa',
  production: false,
  apiBaseUrl: 'https://api.qa.food.example.com',
  useMockApi: false,
  auth: { issuer: 'https://auth.qa.food.example.com/realms/food', clientId: 'food-web-qa' },
  featureFlags: { liveTracking: true, newCheckout: true },
  logLevel: 'info',
};
