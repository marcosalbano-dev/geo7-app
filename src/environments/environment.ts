export const environment = {
  production: false,
  //apiUrl: '/api', // Proxy não está funcionando
  apiUrl: 'http://localhost:8080/api', // URL direta do backend
  //apiUrl: 'https://api.geo7.com.br/api', // URL de produção
  appName: 'Geo7 Engenharia',
  version: '1.0.0',

  // Configurações de autenticação
  auth: {
    tokenKey: 'geo7_token',
    userKey: 'geo7_user',
    tokenExpirationCheck: true
  },
  
  // Configurações de API
  api: {
    timeout: 30000,
    retryAttempts: 3
  },
  
  // Configurações de logging
  logging: {
    level: 'error',
    enableConsole: false
  },
  
  // Configurações de features
  features: {
    enableAnalytics: true,
    enableErrorReporting: true,
    enableDebugMode: false
  }
};

