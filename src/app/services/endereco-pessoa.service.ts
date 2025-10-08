import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnderecoPessoaDTO } from '../models/endereco-pessoa-dto';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class EnderecoPessoaService {

  private apiUrl = `${environment.apiUrl}/endereco-pessoa`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const authHeaders = this.authService.getAuthHeaders();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...authHeaders
    });
  }

  getById(id: number): Observable<EnderecoPessoaDTO> {
    return this.http.get<EnderecoPessoaDTO>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  create(dto: EnderecoPessoaDTO): Observable<EnderecoPessoaDTO> {
    return this.http.post<EnderecoPessoaDTO>(this.apiUrl, dto, {
      headers: this.getHeaders()
    });
  }

  update(id: number, dto: EnderecoPessoaDTO): Observable<EnderecoPessoaDTO> {
    return this.http.put<EnderecoPessoaDTO>(`${this.apiUrl}/${id}`, dto, {
      headers: this.getHeaders()
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }
}
