import { Injectable } from '@angular/core';
import { Lote } from '../models/lote';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { LoteDTO } from '../models/lote-dto';
import { SituacaoJuridicaDTO } from '../models/situacao-juridica.dto';
import { SituacaoJuridica } from '../models/situacao-juridica';

@Injectable({
  providedIn: 'root'
})
export class SituacaoJuridicaService {

  private apiUrl = `${environment.apiUrl}/situacao-juridica`;

  constructor(private http: HttpClient) { }

  // Salvar situacao-juridica na API
  salvar(situacaoJuridica: SituacaoJuridicaDTO): Observable<SituacaoJuridicaDTO> {
    return this.http.post<SituacaoJuridicaDTO>(this.apiUrl, situacaoJuridica);
  }

  // Obter todas as situacoes-juridicas da API
  obterTodos(): Observable<SituacaoJuridicaDTO[]> {
    return this.http.get<SituacaoJuridicaDTO[]>(this.apiUrl);
  }

  // Obter lote por ID
  obterPorId(id: number): Observable<SituacaoJuridica> {
    return this.http.get<SituacaoJuridica>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Atualizar situacao-juridica
  atualizar(id: number, situacaoJuridica: SituacaoJuridica): Observable<SituacaoJuridica> {
    return this.http.put<SituacaoJuridica>(`${this.apiUrl}/${id}`, situacaoJuridica).pipe(
      catchError(this.handleError)
    );
  }

  // Excluir situacao-juridica
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
