import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnderecoPessoaDTO } from '../models/endereco-pessoa-dto';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EnderecoPessoaService {

  private apiUrl = `${environment.apiUrl}/endereco-pessoa`;

  constructor(private http: HttpClient) {}

  getById(id: number): Observable<EnderecoPessoaDTO> {
    return this.http.get<EnderecoPessoaDTO>(`${this.apiUrl}/${id}`);
  }

  create(dto: EnderecoPessoaDTO): Observable<EnderecoPessoaDTO> {
    return this.http.post<EnderecoPessoaDTO>(this.apiUrl, dto);
  }

  update(id: number, dto: EnderecoPessoaDTO): Observable<EnderecoPessoaDTO> {
    return this.http.put<EnderecoPessoaDTO>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
