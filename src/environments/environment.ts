export const environment = {
  production: false,
  //apiUrl: '/api', // Usar proxy do Nginx
  apiUrl: 'http://localhost:8080/api', // URL local para desenvolvimento
  //apiUrl: 'http://18-228-94-6.sslip.io:8080/api', // URL do servidor EC2
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

