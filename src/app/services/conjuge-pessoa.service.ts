import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConjugePessoaDTO } from '../models/conjuge-pessoa.dto';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConjugePessoaService {
  private readonly apiUrl = `${environment.apiUrl}/conjuge-pessoa`;

  constructor(private http: HttpClient) { }

  /**
   * Salva um novo cônjuge
   */
  salvar(conjuge: ConjugePessoaDTO): Observable<ConjugePessoaDTO> {
    return this.http.post<ConjugePessoaDTO>(this.apiUrl, conjuge);
  }

  /**
   * Atualiza um cônjuge existente
   */
  atualizar(id: number, conjuge: ConjugePessoaDTO): Observable<ConjugePessoaDTO> {
    return this.http.put<ConjugePessoaDTO>(`${this.apiUrl}/${id}`, conjuge);
  }

  /**
   * Busca um cônjuge por ID
   */
  buscarPorId(id: number): Observable<ConjugePessoaDTO> {
    return this.http.get<ConjugePessoaDTO>(`${this.apiUrl}/${id}`);
  }

  /**
   * Lista todos os cônjuges
   */
  listarTodos(): Observable<ConjugePessoaDTO[]> {
    return this.http.get<ConjugePessoaDTO[]>(this.apiUrl);
  }

  /**
   * Busca cônjuges por pessoa
   */
  buscarPorPessoa(pessoaId: number): Observable<ConjugePessoaDTO[]> {
    return this.http.get<ConjugePessoaDTO[]>(`${this.apiUrl}/por-pessoa/${pessoaId}`)
      .pipe(
        catchError(error => {
          console.error('Erro ao buscar cônjuges por pessoa:', error);
          // Retorna array vazio em caso de erro (404, 500, etc.)
          return of([]);
        })
      );
  }

  /**
   * Exclui um cônjuge
   */
  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
