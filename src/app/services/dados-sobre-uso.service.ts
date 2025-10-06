import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';
import { DadosSobreUsoDTO } from '../models/dados-sobre-uso.dto';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DadosSobreUsoService {
  private apiUrl = `${environment.apiUrl}/dados-sobre-uso`;

  constructor(private http: HttpClient) { }

  buscarPorId(id: number): Observable<DadosSobreUsoDTO> {
    return this.http.get<DadosSobreUsoDTO>(`${this.apiUrl}/${id}`);
  }

  salvar(dto: DadosSobreUsoDTO): Observable<DadosSobreUsoDTO> {
    return this.http.post<DadosSobreUsoDTO>(this.apiUrl, dto);
  }

  atualizar(id: number, dto: DadosSobreUsoDTO): Observable<DadosSobreUsoDTO> {
    return this.http.put<DadosSobreUsoDTO>(`${this.apiUrl}/${id}`, dto);
  }

  deletar(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  buscarPorLote(loteId: number) {
    return this.http.get<DadosSobreUsoDTO>(`${this.apiUrl}/por-lote/${loteId}`)
    .pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 404) return of(null); // sem registro ainda
        return throwError(() => err);
      })
    );
  }
}
