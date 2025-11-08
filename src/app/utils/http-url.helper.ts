/**
 * Helper para garantir que URLs da API usem o mesmo protocolo da página atual
 * Em produção, se a página foi carregada via HTTPS, a API também usará HTTPS
 */
export function ensureHttpProtocol(url: string): string {
  // Se não estiver no browser, retornar URL original
  if (typeof window === 'undefined') {
    return url;
  }

  const currentProtocol = window.location.protocol; // 'http:' ou 'https:'
  const currentHost = window.location.host;
  
  // Se a URL já é absoluta, garantir que use o mesmo protocolo da página
  if (url.startsWith('https://') || url.startsWith('http://')) {
    // Se a página está em HTTPS e a URL é HTTP, converter para HTTPS
    if (currentProtocol === 'https:' && url.startsWith('http://')) {
      const httpsUrl = url.replace('http://', 'https://');
      console.log('[ensureHttpProtocol] Converted HTTP to HTTPS:', url, '->', httpsUrl);
      return httpsUrl;
    }
    // Se a página está em HTTP e a URL é HTTPS, converter para HTTP
    if (currentProtocol === 'http:' && url.startsWith('https://')) {
      const httpUrl = url.replace('https://', 'http://');
      console.log('[ensureHttpProtocol] Converted HTTPS to HTTP:', url, '->', httpUrl);
      return httpUrl;
    }
    // Já está no protocolo correto
    return url;
  }
  
  // Se é URL relativa, construir URL absoluta com o mesmo protocolo da página
  if (url.startsWith('/')) {
    const absoluteUrl = `${currentProtocol}//${currentHost}${url}`;
    console.log('[ensureHttpProtocol] Built absolute URL:', url, '->', absoluteUrl);
    return absoluteUrl;
  }
  
  // URL relativa sem barra inicial
  const absoluteUrl = `${currentProtocol}//${currentHost}/${url}`;
  console.log('[ensureHttpProtocol] Built absolute URL (no slash):', url, '->', absoluteUrl);
  return absoluteUrl;
}

