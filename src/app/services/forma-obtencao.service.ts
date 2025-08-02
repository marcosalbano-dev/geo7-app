// services/forma-obtencao.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
}
