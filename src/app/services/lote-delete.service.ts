import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of, catchError, throwError, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoteService } from './lote.service';
import { PessoaLoteService } from './pessoa-lote.service';
import { FormaObtencaoService } from './forma-obtencao.service';
import { DadosSobreUsoService } from './dados-sobre-uso.service';
import { EstruturaService } from './estrutura.service';

@Injectable({
  providedIn: 'root'
})
export class LoteDeleteService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(
    private http: HttpClient,
    private loteService: LoteService,
    private pessoaLoteService: PessoaLoteService,
    private formaObtencaoService: FormaObtencaoService,
    private dadosSobreUsoService: DadosSobreUsoService,
    private estruturaService: EstruturaService
  ) {}

  /**
   * Deleta um lote seguindo a sequência específica fornecida:
   * 1. pessoa_lote
   * 2. forma_obtencao
   * 3. dados_sobre_uso
   * 4. item (se existir)
   * 5. estrutura
   * 6. lotes
   */
  deletarLoteCompleto(loteId: number): Observable<any> {
    console.log(`🗑️ Iniciando deleção completa do lote ${loteId}`);
    
    return new Observable(observer => {
      // Sequência de deleção conforme especificado
      this.executarSequenciaDelecao(loteId)
        .subscribe({
          next: (resultado) => {
            console.log(`✅ Lote ${loteId} deletado com sucesso!`);
            observer.next(resultado);
            observer.complete();
          },
          error: (error) => {
            console.error(`❌ Erro ao deletar lote ${loteId}:`, error);
            observer.error(error);
          }
        });
    });
  }

  private executarSequenciaDelecao(loteId: number): Observable<any> {
    console.log(`🔄 Executando sequência de deleção para lote ${loteId}`);
    
    // 1. Deletar pessoa_lote
    return this.deletarPessoaLote(loteId).pipe(
      catchError(error => {
        console.warn(`⚠️ Erro ao deletar pessoa_lote para lote ${loteId}:`, error);
        return of(null); // Continua mesmo se falhar
      }),
      // 2. Deletar forma_obtencao
      switchMap(() => this.deletarFormaObtencao(loteId).pipe(
        catchError(error => {
          console.warn(`⚠️ Erro ao deletar forma_obtencao para lote ${loteId}:`, error);
          return of(null);
        })
      )),
      // 3. Deletar dados_sobre_uso
      switchMap(() => this.deletarDadosSobreUso(loteId).pipe(
        catchError(error => {
          console.warn(`⚠️ Erro ao deletar dados_sobre_uso para lote ${loteId}:`, error);
          return of(null);
        })
      )),
      // 4. Deletar item (se existir)
      switchMap(() => this.deletarItens(loteId).pipe(
        catchError(error => {
          console.warn(`⚠️ Erro ao deletar itens para lote ${loteId}:`, error);
          return of(null);
        })
      )),
      // 5. Deletar estrutura
      switchMap(() => this.deletarEstrutura(loteId).pipe(
        catchError(error => {
          console.warn(`⚠️ Erro ao deletar estrutura para lote ${loteId}:`, error);
          return of(null);
        })
      )),
      // 6. Deletar lote (final)
      switchMap(() => this.loteService.deletar(loteId))
    );
  }

  private deletarPessoaLote(loteId: number): Observable<any> {
    console.log(`🗑️ Deletando pessoa_lote para lote ${loteId}`);
    
    // Buscar todas as pessoas_lote e filtrar por loteId
    return this.pessoaLoteService.obterTodos().pipe(
      switchMap((pessoasLote: any[]) => {
        if (!pessoasLote || pessoasLote.length === 0) {
          console.log(`ℹ️ Nenhuma pessoa_lote encontrada no sistema`);
          return of(null);
        }
        
        // Filtrar pessoas_lote por loteId
        const pessoasDoLote = pessoasLote.filter(pessoaLote => pessoaLote.loteId === loteId);
        
        if (pessoasDoLote.length === 0) {
          console.log(`ℹ️ Nenhuma pessoa_lote encontrada para lote ${loteId}`);
          return of(null);
        }
        
        console.log(`🗑️ Encontradas ${pessoasDoLote.length} pessoas_lote para deletar do lote ${loteId}`);
        
        // Deletar todas as pessoas_lote encontradas
        const deleteRequests = pessoasDoLote.map(pessoaLote => 
          this.pessoaLoteService.excluir(pessoaLote.id)
        );
        
        return forkJoin(deleteRequests);
      }),
      catchError(error => {
        console.log(`ℹ️ Erro ao buscar pessoas_lote para lote ${loteId}: ${error.status}`);
        return of(null);
      })
    );
  }

  private deletarFormaObtencao(loteId: number): Observable<any> {
    console.log(`🗑️ Deletando forma_obtencao para lote ${loteId}`);
    
    return this.formaObtencaoService.buscarPorLoteId(loteId).pipe(
      switchMap((formaObtencao: any) => {
        if (!formaObtencao) {
          console.log(`ℹ️ Nenhuma forma_obtencao encontrada para lote ${loteId}`);
          return of(null);
        }
        
        console.log(`🗑️ Deletando forma_obtencao ID: ${formaObtencao.id}`);
        return this.formaObtencaoService.deletar(formaObtencao.id);
      }),
      catchError(error => {
        console.log(`ℹ️ Nenhuma forma_obtencao encontrada para lote ${loteId} (erro: ${error.status})`);
        return of(null);
      })
    );
  }

  private deletarDadosSobreUso(loteId: number): Observable<any> {
    console.log(`🗑️ Deletando dados_sobre_uso para lote ${loteId}`);
    
    return this.dadosSobreUsoService.buscarPorLote(loteId).pipe(
      switchMap((dadosSobreUso: any) => {
        if (!dadosSobreUso) {
          console.log(`ℹ️ Nenhum dados_sobre_uso encontrado para lote ${loteId}`);
          return of(null);
        }
        
        console.log(`🗑️ Deletando dados_sobre_uso ID: ${dadosSobreUso.id}`);
        return this.dadosSobreUsoService.deletar(dadosSobreUso.id);
      }),
      catchError(error => {
        console.log(`ℹ️ Nenhum dados_sobre_uso encontrado para lote ${loteId} (erro: ${error.status})`);
        return of(null);
      })
    );
  }

  private deletarItens(loteId: number): Observable<any> {
    console.log(`🗑️ Deletando itens para lote ${loteId}`);
    
    // Buscar itens por loteId usando o endpoint correto
    return this.http.get<any[]>(`${this.apiUrl}/itens`).pipe(
      switchMap((itens: any[]) => {
        if (!itens || itens.length === 0) {
          console.log(`ℹ️ Nenhum item encontrado no sistema`);
          return of(null);
        }
        
        // Filtrar itens por loteId
        const itensDoLote = itens.filter(item => item.loteId === loteId);
        
        if (itensDoLote.length === 0) {
          console.log(`ℹ️ Nenhum item encontrado para lote ${loteId}`);
          return of(null);
        }
        
        console.log(`🗑️ Encontrados ${itensDoLote.length} itens para deletar do lote ${loteId}`);
        
        // Deletar todos os itens encontrados
        const deleteRequests = itensDoLote.map(item => 
          this.http.delete(`${this.apiUrl}/itens/${item.id}`)
        );
        
        return forkJoin(deleteRequests);
      }),
      catchError(error => {
        console.log(`ℹ️ Erro ao buscar itens para lote ${loteId}: ${error.status}`);
        return of(null);
      })
    );
  }

  private deletarEstrutura(loteId: number): Observable<any> {
    console.log(`🗑️ Deletando estrutura para lote ${loteId}`);
    
    return this.estruturaService.buscarPorLoteId(loteId).pipe(
      switchMap((estrutura: any) => {
        if (!estrutura) {
          console.log(`ℹ️ Nenhuma estrutura encontrada para lote ${loteId}`);
          return of(null);
        }
        
        console.log(`🗑️ Deletando estrutura ID: ${estrutura.id}`);
        return this.estruturaService.delete(estrutura.id);
      }),
      catchError(error => {
        console.log(`ℹ️ Nenhuma estrutura encontrada para lote ${loteId} (erro: ${error.status})`);
        return of(null);
      })
    );
  }
}
