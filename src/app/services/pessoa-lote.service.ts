import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { PessoaLoteDTO } from '../models/pessoa-lote.dto'; // Se usar DTO

@Injectable({
  providedIn: 'root'
})
export class PessoaLoteService {

  private apiUrl = `${environment.apiUrl}/pessoa-lote`;

  constructor(private http: HttpClient) { }

  // Salvar PessoaLote na API
  salvar(pessoaLote: PessoaLoteDTO): Observable<PessoaLoteDTO> {
   
    return this.http.post<PessoaLoteDTO>(`${this.apiUrl}/pessoa-lote`, pessoaLote);
  }

  // Obter todos os PessoaLote da API
  obterTodos(): Observable<PessoaLoteDTO[]> {
    return this.http.get<PessoaLoteDTO[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  // Obter PessoaLote por ID
  obterPorId(id: number): Observable<PessoaLoteDTO> {
    return this.http.get<PessoaLoteDTO>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Atualizar PessoaLote
  atualizar(id: number, pessoaLote: PessoaLoteDTO): Observable<PessoaLoteDTO> {
    return this.http.put<PessoaLoteDTO>(`${this.apiUrl}/${id}`, pessoaLote)
      .pipe(catchError(this.handleError));
  }

  // Excluir PessoaLote
  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Tratamento de erros
  private handleError(error: any): Observable<never> {
    console.error('Ocorreu um erro:', error);
    return throwError(() => new Error('Erro ao processar a requisição. Tente novamente mais tarde.'));
  }
}
