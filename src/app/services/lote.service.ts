import { Injectable } from '@angular/core';
import { Lote } from '../models/lote';
import { Observable, catchError, throwError } from 'rxjs';
import { LoteDTO } from '../models/lote-dto';
import { ApiService } from './api.service';

export interface LoteFiltroDTO {
  proprietario?: string;
  cpf?: string;
  numero?: string;
  municipioId?: number;
  denominacaoImovel?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoteService {

  constructor(private apiService: ApiService) { }

  // Salvar lote na API
  salvar(lote: LoteDTO): Observable<LoteDTO> {
    return this.apiService.post<LoteDTO>('/lotes', lote);
  }

  // Obter todas os lotes da API
  obterTodos(): Observable<LoteDTO[]> {
    return this.apiService.get<LoteDTO[]>('/lotes');
  }

  // Obter lote por ID
  obterPorId(id: number): Observable<LoteDTO> {
    return this.apiService.get<LoteDTO>(`/lotes/${id}`);
  }

  // Obter lote por Proprietário
  obterPorProprietario(proprietario: string): Observable<Lote[]> {
    return this.apiService.get<Lote[]>(`/lotes?proprietario=${proprietario}`);
  }

  filtrarLotes(filtro: LoteFiltroDTO): Observable<LoteDTO[]> {
    return this.apiService.post<LoteDTO[]>('/lotes/filtrar', filtro);
  }

  // Atualizar lote
  atualizar(id: number, lote: LoteDTO): Observable<LoteDTO> {
    return this.apiService.put<LoteDTO>(`/lotes/${id}`, lote);
  }

  // Excluir lote
  deletar(id: number): Observable<LoteDTO> {
    return this.apiService.delete<LoteDTO>(`/lotes/${id}`);
  }
}
