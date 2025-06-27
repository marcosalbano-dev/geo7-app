// pessoas.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PessoaDTO } from '../models/cadastro-pessoa.dto';

@Injectable({ providedIn: 'root' })
export class PessoasService {
  private apiUrl = `${environment.apiUrl}/pessoas`;

  constructor(private http: HttpClient) {}

  salvarPessoa(dados: PessoaDTO): Observable<PessoaDTO> {
    return this.http.post<PessoaDTO>(`${environment.apiUrl}/pessoas`, dados);
  }

}
