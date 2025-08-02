import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AtualizaDetentorRequestDTO } from '../models/atualiza-detentor-request-dto';
import { EditarDetentorResponseDTO } from '../models/editar-detentor-response-dto';
import { PessoaDTO } from '../models/pessoa.dto';

@Injectable({ providedIn: 'root' })
export class PessoasService {
  private apiUrl = `${environment.apiUrl}/pessoas`;

  constructor(private http: HttpClient) {}

  /** Cadastro completo de pessoa+vinculos+documento+endereco */
  salvarPessoa(dados: AtualizaDetentorRequestDTO): Observable<PessoaDTO> {
    return this.http.post<PessoaDTO>(`${this.apiUrl}`, dados);
  }

  /** Atualização completa */
  atualizarPessoa(pessoaLoteId: number, dados: AtualizaDetentorRequestDTO): Observable<PessoaDTO> {
    return this.http.put<PessoaDTO>(`${this.apiUrl}/${pessoaLoteId}`, dados);
  }

  /** Buscar para edição (carrega todos os dados necessários) */
  buscarParaEdicao(pessoaLoteId: number): Observable<EditarDetentorResponseDTO> {
    return this.http.get<EditarDetentorResponseDTO>(`${this.apiUrl}/editar/${pessoaLoteId}`);
  }

  /** Listar pessoas (pode ser só PessoaDTO, conforme backend) */
  listarPessoas(): Observable<PessoaDTO[]> {
    return this.http.get<PessoaDTO[]>(this.apiUrl);
  }

  /** Buscar pessoa por id (apenas dados da pessoa, não o combinado) */
  buscarPorId(id: number): Observable<PessoaDTO> {
    return this.http.get<PessoaDTO>(`${this.apiUrl}/${id}`);
  }
}
