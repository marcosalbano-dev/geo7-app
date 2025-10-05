import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, of, throwError, map } from 'rxjs';
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
    console.log(`🔍 Buscando dados sobre uso para loteId: ${loteId}`);
    return this.http.get<DadosSobreUsoDTO>(`${this.apiUrl}/por-lote/${loteId}`)
    .pipe(
      catchError((err: HttpErrorResponse) => {
        console.warn(`⚠️ Endpoint /por-lote/${loteId} falhou com status ${err.status}`);
        
        if (err.status === 404) {
          console.log(`ℹ️ Nenhum dado encontrado para loteId ${loteId} (404 - comportamento esperado se não há dados)`);
          return of(null);
        }
        
        // Para outros erros, tentar buscar todos os dados como fallback
        console.warn(`⚠️ Erro ${err.status} no endpoint específico. Tentando buscar todos os dados...`);
        return this.buscarTodosEFiltrar(loteId);
      })
    );
  }

  private buscarTodosEFiltrar(loteId: number) {
    console.log(`🔄 Tentando buscar todos os dados sobre uso e filtrar por loteId: ${loteId}`);
    return this.http.get<DadosSobreUsoDTO[]>(`${this.apiUrl}`)
    .pipe(
      map((dados: DadosSobreUsoDTO[]) => {
        console.log(`📊 Dados recebidos do backend (${dados?.length || 0} registros):`, dados);
        
        if (!dados || dados.length === 0) {
          console.log(`ℹ️ Nenhum dado encontrado no backend`);
          return null;
        }
        
        const dadosFiltrados = dados.find(d => d.loteId === loteId);
        console.log(`🎯 Dados filtrados para loteId ${loteId}:`, dadosFiltrados);
        
        if (!dadosFiltrados) {
          console.log(`ℹ️ Nenhum dado encontrado para loteId ${loteId}. Dados disponíveis para loteIds:`, dados.map(d => d.loteId));
        }
        
        return dadosFiltrados || null;
      }),
      catchError((err: HttpErrorResponse) => {
        console.error('❌ Erro ao buscar todos os dados sobre uso:', err);
        console.error('❌ Status:', err.status, 'Message:', err.message);
        return of(null);
      })
    );
  }
}
