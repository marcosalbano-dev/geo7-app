export const environment = {
  production: true,
  apiUrl: 'https://api.geo7.com.br/api',
  appName: 'Geo7 Engenharia',
  version: '1.0.0',
  
  auth: {
    tokenKey: 'geo7_token',
    userKey: 'geo7_user',
    tokenExpirationCheck: true
  },
  
  api: {
    timeout: 30000,
    retryAttempts: 3
  },
  
  logging: {
    level: 'error',
    enableConsole: false
  },
  
  features: {
    enableAnalytics: true,
    enableErrorReporting: true,
    enableDebugMode: false
  }
};
