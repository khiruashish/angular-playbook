export interface AppEnvironment {
  name: 'dev' | 'qa' | 'uat' | 'prod';
  production: boolean;
  apiBaseUrl: string;
  /** When true, an HTTP interceptor serves fake data so the UI runs without a backend. */
  useMockApi: boolean;
  auth: { issuer: string; clientId: string };
  featureFlags: { liveTracking: boolean; newCheckout: boolean };
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}
