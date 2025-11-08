export const environment = {
  production: true,
  // Usar URL relativa - será convertida para absoluta com HTTP em runtime pelo helper
  // O helper ensureHttpProtocol garante que URLs relativas sejam convertidas para
  // URLs absolutas com HTTP quando a página foi carregada via HTTP
  apiUrl: '/api',
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
