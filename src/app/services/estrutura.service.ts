import { Injectable } from '@angular/core';
import { Estrutura } from '../models/estrutura';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { EstruturaDTO } from '../models/estrutura-dto';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EstruturaService {

  private apiUrl = `${environment.apiUrl}/estrutura`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getHeaders(): HttpHeaders {
    const authHeaders = this.authService.getAuthHeaders();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...authHeaders
    });
  }

  // Salvar estrutura na API
  salvar(estrutura: EstruturaDTO): Observable<EstruturaDTO> {
    console.log("Payload enviado:", estrutura);
    return this.http.post<EstruturaDTO>(`${environment.apiUrl}/estrutura`, estrutura, {
      headers: this.getHeaders()
    });
  }

  buscarPorLoteId(loteId: number) {
    return this.http.get<EstruturaDTO>(`${this.apiUrl}/por-lote/${loteId}`, {
      headers: this.getHeaders()
    });
  }

  // Obter todas as estruturas da API
  obterTodas(): Observable<EstruturaDTO[]> {
    return this.http.get<EstruturaDTO[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  // Obter estrutura por ID
  obterPorId(id: number): Observable<Estrutura> {
    return this.http.get<Estrutura>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Atualizar estrutura
  atualizar(id: number, estrutura: EstruturaDTO): Observable<EstruturaDTO> {
    console.log('[EstruturaService] 🔍 Payload enviado para atualização:', estrutura);
    console.log('[EstruturaService] 🔍 - pontoDeReferencia no payload:', estrutura.pontoDeReferencia);
    return this.http.put<EstruturaDTO>(`${this.apiUrl}/${id}`,estrutura, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  // Tratamento de erros
  private handleError(error: any): Observable<never> {
    console.error('Ocorreu um erro:', error);
    return throwError(() => new Error('Erro ao processar a requisição. Tente novamente mais tarde.'));
  }
  
  
}
