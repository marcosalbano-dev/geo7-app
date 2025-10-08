import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AtualizaDetentorRequestDTO } from '../models/atualiza-detentor-request-dto';
import { EditarDetentorResponseDTO } from '../models/editar-detentor-response-dto';
import { PessoaDTO } from '../models/pessoa.dto';
import { PessoaRespostaDTO } from '../models/pessoa-resposta.dto';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class PessoasService {
  private apiUrl = `${environment.apiUrl}/pessoas`;

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

  /** Cadastro completo de pessoa+vinculos+documento+endereco */
  salvarPessoa(dados: AtualizaDetentorRequestDTO): Observable<PessoaRespostaDTO> {
    return this.http.post<PessoaRespostaDTO>(`${this.apiUrl}`, dados, {
      headers: this.getHeaders()
    });
  }

  excluirPessoa(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  /** Atualização completa */
  atualizarPessoa(pessoaLoteId: number, dados: AtualizaDetentorRequestDTO) {
    return this.http.put<EditarDetentorResponseDTO>(`${this.apiUrl}/${pessoaLoteId}`, dados, {
      headers: this.getHeaders()
    });
  }

  /** Buscar para edição (carrega todos os dados necessários) */
  buscarParaEdicao(pessoaLoteId: number): Observable<EditarDetentorResponseDTO> {
    return this.http.get<EditarDetentorResponseDTO>(`${this.apiUrl}/editar/${pessoaLoteId}`, {
      headers: this.getHeaders()
    });
  }

  /** Listar pessoas (pode ser só PessoaDTO, conforme backend) */
  listarPessoas(): Observable<PessoaRespostaDTO[]> {
    return this.http.get<PessoaRespostaDTO[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  /** Buscar pessoa por id (apenas dados da pessoa, não o combinado) */
  buscarPorId(id: number): Observable<PessoaRespostaDTO> {
    return this.http.get<PessoaRespostaDTO>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  buscarParaEdicaoPorLote(loteId: number) {
    // Endpoint para buscar dados de pessoa por lote
    // Se o endpoint não existir, retorna 404 (comportamento esperado)
    return this.http.get<EditarDetentorResponseDTO>(`${this.apiUrl}/editar/por-lote/${loteId}`, {
      headers: this.getHeaders()
    });
  }
}
