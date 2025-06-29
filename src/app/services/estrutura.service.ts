import { Injectable } from '@angular/core';
import { Estrutura } from '../models/estrutura';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { EstruturaDTO } from '../models/estrutura-dto';

@Injectable({
  providedIn: 'root'
})
export class EstruturaService {

  private apiUrl = `${environment.apiUrl}/estrutura`;

  constructor(private http: HttpClient) { }

  // Salvar estrutura na API
  salvar(estrutura: EstruturaDTO): Observable<EstruturaDTO> {
    console.log("Payload enviado:", estrutura);
    return this.http.post<EstruturaDTO>(`${environment.apiUrl}/estrutura`, estrutura);
  }

  // Obter todas as estruturas da API
  obterTodas(): Observable<EstruturaDTO[]> {
    return this.http.get<EstruturaDTO[]>(this.apiUrl);
  }

  // Obter estrutura por ID
  obterPorId(id: number): Observable<Estrutura> {
    return this.http.get<Estrutura>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Atualizar estrutura
  atualizar(id: number, estrutura: Estrutura): Observable<Estrutura> {
    return this.http.put<Estrutura>(`${this.apiUrl}/${id}`, estrutura).pipe(
      catchError(this.handleError)
    );
  }

  // Excluir estrutura
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
