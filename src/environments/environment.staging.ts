export const environment = {
  production: false,
  apiUrl: 'https://staging-api.geo7.com.br/api',
  appName: 'Geo7 Engenharia - Staging',
  version: '1.0.0-staging',
  
  auth: {
    tokenKey: 'geo7_token_staging',
    userKey: 'geo7_user_staging',
    tokenExpirationCheck: true
  },
  
  api: {
    timeout: 30000,
    retryAttempts: 3
  },
  
  logging: {
    level: 'info',
    enableConsole: true
  },
  
  features: {
    enableAnalytics: false,
    enableErrorReporting: true,
    enableDebugMode: true
  }
};
