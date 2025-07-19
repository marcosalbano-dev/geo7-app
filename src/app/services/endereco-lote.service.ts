import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnderecoLoteDTO } from '../models/endereco-lote-dto';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnderecoLoteService {
  private apiUrl = `${environment.apiUrl}/endereco-lote`;

  constructor(private http: HttpClient) {}

  salvar(dto: EnderecoLoteDTO): Observable<EnderecoLoteDTO> {
    return this.http.post<EnderecoLoteDTO>(this.apiUrl, dto);
  }

  atualizar(id: number, dto: EnderecoLoteDTO): Observable<EnderecoLoteDTO> {
    return this.http.put<EnderecoLoteDTO>(`${this.apiUrl}/${id}`, dto);
  }

  buscarPorId(id: number): Observable<EnderecoLoteDTO> {
    return this.http.get<EnderecoLoteDTO>(`${this.apiUrl}/${id}`);
  }
}
