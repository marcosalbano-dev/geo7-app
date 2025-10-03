// services/forma-obtencao.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { FormaObtencaoDTO } from '../models/forma-obtencao-dto';

@Injectable({ providedIn: 'root' })
export class FormaObtencaoService {
  private apiUrl = '/api/forma-obtencao';

  constructor(private http: HttpClient) {}

  salvar(dto: FormaObtencaoDTO): Observable<FormaObtencaoDTO> {
    return this.http.post<FormaObtencaoDTO>(this.apiUrl, dto);
  }

  buscarPorId(id: number): Observable<FormaObtencaoDTO> {
    return this.http.get<FormaObtencaoDTO>(`${this.apiUrl}/${id}`);
  }

  listarTodas(): Observable<FormaObtencaoDTO[]> {
    return this.http.get<FormaObtencaoDTO[]>(this.apiUrl);
  }

  atualizar(id: number, dto: FormaObtencaoDTO): Observable<FormaObtencaoDTO> {
    return this.http.put<FormaObtencaoDTO>(`${this.apiUrl}/${id}`, dto);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  buscarPorLoteId(loteId: number): Observable<FormaObtencaoDTO> {
    return this.http.get<FormaObtencaoDTO>(`${this.apiUrl}/por-lote/${loteId}`).pipe(
      catchError(err => {
        if (err?.status === 200 && !err.ok) {
          console.warn('[FormaObtencaoService] ⚠️ Endpoint retornou HTML em vez de JSON - provavelmente endpoint não implementado corretamente');
          console.warn('[FormaObtencaoService] URL:', err.url);
          // Transforma em um erro 404 para ser tratado como "não encontrado"
          const notFoundError = { ...err, status: 404, statusText: 'Not Found' };
          throw notFoundError;
        }
        console.error('[FormaObtencaoService] Erro ao buscar por lote:', err);
        throw err;
      })
    );
  }
}
