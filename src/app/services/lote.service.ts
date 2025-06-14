import { Injectable } from '@angular/core';
import { Lote } from '../models/lote';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { LoteDTO } from '../models/lote-dto';

@Injectable({
  providedIn: 'root'
})
export class LoteService {

  private apiUrl = `${environment.apiUrl}/lotes`;

  constructor(private http: HttpClient) { }

  // Salvar lote na API
  salvar(lote: LoteDTO): Observable<LoteDTO> {
    return this.http.post<LoteDTO>(this.apiUrl, lote);
  }

  // Obter todas os lotes da API
  obterTodos(): Observable<LoteDTO[]> {
    return this.http.get<LoteDTO[]>(this.apiUrl);
  }

  // Obter lote por ID
  obterPorId(id: number): Observable<Lote> {
    return this.http.get<Lote>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Atualizar lote
  atualizar(id: number, lote: Lote): Observable<Lote> {
    return this.http.put<Lote>(`${this.apiUrl}/${id}`, lote).pipe(
      catchError(this.handleError)
    );
  }

  // Excluir lote
  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Tratamento de erros
  private handleError(error: any): Observable<never> {
    console.error('Ocorreu um erro:', error);
    return throwError(() => new Error('Erro ao processar a requisição. Tente novamente mais tarde.'));
  }
}
