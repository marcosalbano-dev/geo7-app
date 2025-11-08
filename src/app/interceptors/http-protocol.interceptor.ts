import { HttpInterceptorFn } from '@angular/common/http';
import { ensureHttpProtocol } from '../utils/http-url.helper';

/**
 * Interceptor funcional para garantir que URLs relativas sejam convertidas para absolutas
 * usando o mesmo protocolo da página atual (HTTP ou HTTPS)
 */
export const httpProtocolInterceptor: HttpInterceptorFn = (req, next) => {
  // Log para debug
  console.log('[HTTP Interceptor] Original URL:', req.url);
  console.log('[HTTP Interceptor] Page protocol:', typeof window !== 'undefined' ? window.location.protocol : 'N/A');
  
  // Usar helper para garantir que a URL use o mesmo protocolo da página
  const newUrl = ensureHttpProtocol(req.url);
  
  // Se a URL mudou, criar nova requisição
  if (newUrl !== req.url) {
    console.log('[HTTP Interceptor] URL changed:', req.url, '->', newUrl);
    const httpReq = req.clone({
      url: newUrl
    });
    return next(httpReq);
  }
  
  console.log('[HTTP Interceptor] URL unchanged');
  return next(req);
};

