import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AtualizaDetentorRequestDTO } from '../models/atualiza-detentor-request-dto';
import { EditarDetentorResponseDTO } from '../models/editar-detentor-response-dto';
import { PessoaDTO } from '../models/pessoa.dto';
import { PessoaRespostaDTO } from '../models/pessoa-resposta.dto';

@Injectable({ providedIn: 'root' })
export class PessoasService {
  private apiUrl = `${environment.apiUrl}/pessoas`;

  constructor(private http: HttpClient) {}

  /** Cadastro completo de pessoa+vinculos+documento+endereco */
  salvarPessoa(dados: AtualizaDetentorRequestDTO): Observable<PessoaRespostaDTO> {
    return this.http.post<PessoaRespostaDTO>(`${this.apiUrl}`, dados);
  }

  excluirPessoa(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /** Atualização completa */
  atualizarPessoa(pessoaLoteId: number, dados: AtualizaDetentorRequestDTO) {
    return this.http.put<EditarDetentorResponseDTO>(`${this.apiUrl}/${pessoaLoteId}`, dados);
  }

  /** Buscar para edição (carrega todos os dados necessários) */
  buscarParaEdicao(pessoaLoteId: number): Observable<EditarDetentorResponseDTO> {
    return this.http.get<EditarDetentorResponseDTO>(`${this.apiUrl}/editar/${pessoaLoteId}`);
  }

  /** Listar pessoas (pode ser só PessoaDTO, conforme backend) */
  listarPessoas(): Observable<PessoaRespostaDTO[]> {
    return this.http.get<PessoaRespostaDTO[]>(this.apiUrl);
  }

  /** Buscar pessoa por id (apenas dados da pessoa, não o combinado) */
  buscarPorId(id: number): Observable<PessoaRespostaDTO> {
    return this.http.get<PessoaRespostaDTO>(`${this.apiUrl}/${id}`);
  }

  buscarParaEdicaoPorLote(loteId: number) {
    // Endpoint para buscar dados de pessoa por lote
    // Se o endpoint não existir, retorna 404 (comportamento esperado)
    return this.http.get<EditarDetentorResponseDTO>(`${this.apiUrl}/editar/por-lote/${loteId}`);
  }
}
