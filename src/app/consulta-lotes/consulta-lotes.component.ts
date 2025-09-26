import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';

// Importando os componentes reutilizáveis
import { FormFieldComponent } from '../shared/components/form-field/form-field.component';
import { CardComponent } from '../shared/components/card/card.component';
import { DataTableComponent } from '../shared/components/data-table/data-table.component';
import { ConfirmDialogComponent } from '../shared/components/confirm-dialog/confirm-dialog.component';

// Importando os serviços
import { LoteService, LoteFiltroDTO } from '../services/lote.service';
import { MunicipioService } from '../services/municipio.service';
import { SituacaoJuridicaService } from '../services/situacao-juridica.service';
import { ExportacaoDpService } from '../exportacao-dp/exportacao-dp.service';

// Importando os modelos
import { LoteDTO } from '../models/lote-dto';
import { Municipio } from '../models/municipio';
import { SituacaoJuridica } from '../models/situacao-juridica';

// Interface para dados da tabela
interface LoteTableData extends LoteDTO {
  situacaoJuridicaNome: string;
}

@Component({
  selector: 'app-consulta-lotes',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    FormFieldComponent,
    CardComponent,
    DataTableComponent
  ],
  template: `
    <div class="consulta-lotes-container">
      <!-- Loading Indicator -->
      <div *ngIf="isLoading" class="loading-indicator">
        <mat-spinner diameter="40"></mat-spinner>
        <span class="loading-text">Processando...</span>
      </div>

      <!-- Filtros de Busca -->
      <app-card 
        title="Filtros de Busca"
        subtitle="Configure os filtros para encontrar lotes"
        [showActions]="false">
        
        <form [formGroup]="filtrosForm" class="form-grid">
          <div class="col-3">
            <app-form-field
              type="text"
              label="Controle de Campo"
              placeholder="Ex: 00001"
              formControlName="numero">
            </app-form-field>
          </div>
          
          <div class="col-3">
            <app-form-field
              type="text"
              label="Proprietário"
              placeholder="Ex: José..."
              formControlName="proprietario">
            </app-form-field>
          </div>
          
          <div class="col-3">
            <mat-form-field class="full-width">
              <mat-label>Município</mat-label>
              <mat-select formControlName="municipioId">
                <mat-option *ngFor="let municipio of municipios" [value]="municipio.id">
                  {{ municipio.nome }}
                </mat-option>
              </mat-select>
            </mat-form-field>
          </div>
          
          <div class="col-3">
            <mat-form-field class="full-width">
              <mat-label>Situação Jurídica</mat-label>
              <mat-select formControlName="situacaoJuridicaId">
                <mat-option *ngFor="let situacao of situacoes; trackBy: trackBySituacao" [value]="situacao.id">
                  {{ situacao.nome }}
                </mat-option>
              </mat-select>
            </mat-form-field>
          </div>
          
          <div class="col-12 actions">
            <button 
              mat-raised-button 
              color="primary"
              (click)="pesquisar()"
              [disabled]="isLoading">
              <mat-spinner *ngIf="isLoading" diameter="20" class="button-spinner"></mat-spinner>
              <mat-icon *ngIf="!isLoading">search</mat-icon>
              {{ isLoading ? 'Pesquisando...' : 'Pesquisar' }}
            </button>
            
            <span class="spacer"></span>
            
            <button 
              mat-stroked-button
              (click)="abrirBuscaAvancada()"
              [disabled]="isLoading">
              <mat-icon>manage_search</mat-icon>
              Busca Avançada
            </button>
            
            <button 
              mat-raised-button 
              color="primary"
              (click)="novoImovel()"
              [disabled]="isLoading">
              <mat-icon>add</mat-icon>
              Novo Imóvel
            </button>
          </div>
        </form>
      </app-card>

      <!-- Header Resultado -->
      <div *ngIf="listaLotes.length > 0" class="result-header">
        <div class="title">
          <span>{{ municipioSelecionadoNome || 'Todos os municípios' }}</span>
          <span class="code" *ngIf="filtrosForm.get('municipioId')?.value">[ {{ filtrosForm.get('municipioId')?.value }} ]</span>
        </div>
        <div class="header-actions">
          <button 
            mat-stroked-button
            color="primary"
            (click)="onExportarMunicipio(filtrosForm.get('municipioId')?.value)"
            [disabled]="!filtrosForm.get('municipioId')?.value || !listaLotes.length || isLoading">
            <mat-spinner *ngIf="isLoading" diameter="20" class="button-spinner"></mat-spinner>
            <mat-icon *ngIf="!isLoading">download</mat-icon>
            {{ isLoading ? 'Exportando...' : 'Exportar XML' }}
          </button>
          <div class="total">TOTAL: {{ total }}</div>
        </div>
      </div>

      <!-- Resultados da Busca -->
      <app-card 
        *ngIf="listaLotes.length > 0"
        title="Resultados da Busca"
        subtitle="Lotes encontrados"
        [showActions]="false">
        
        <app-data-table
          [data]="listaLotes"
          [columns]="loteColumns"
          [showActions]="true"
          [showEditButton]="false"
          [showDeleteButton]="false"
          [showPaginator]="true"
          [totalItems]="total"
          [pageSize]="10"
          [actionsTemplate]="actionsTemplate">
        </app-data-table>
      </app-card>
    </div>

    <!-- Template para ações customizadas -->
    <ng-template #actionsTemplate let-row let-index="index">
      <!-- Estrutura (laranja) -->
      <button 
        mat-mini-fab 
        class="btn-estrutura" 
        matTooltip="Estrutura"
        (click)="preparaEditarEstrutura(row.id)">
        <mat-icon>settings</mat-icon>
      </button>

      <!-- Uso (verde) -->
      <button 
        mat-mini-fab 
        class="btn-uso" 
        matTooltip="Dados de Uso da Terra"
        (click)="preparaEditarDadosUso(row.id)">
        <mat-icon>eco</mat-icon>
      </button>

      <!-- Dados Pessoais (azul) -->
      <button 
        mat-mini-fab 
        class="btn-pessoas" 
        matTooltip="Dados Pessoais"
        (click)="preparaEditarDadosPessoais(row.id)">
        <mat-icon>person</mat-icon>
      </button>

      <!-- Endereço do Imóvel (roxo) -->
      <button 
        mat-mini-fab 
        class="btn-endereco" 
        matTooltip="Endereço do Imóvel"
        (click)="preparaEditarEnderecoLote(row.id)">
        <mat-icon>place</mat-icon>
      </button>

      <!-- Imóvel (cinza) -->
      <button 
        mat-mini-fab 
        class="btn-imovel" 
        matTooltip="Editar Imóvel" 
        (click)="preparaEditarLote(row.id)">
        <mat-icon>home</mat-icon>
      </button>

      <!-- Excluir (vermelho) -->
      <button 
        mat-mini-fab 
        class="btn-excluir" 
        matTooltip="Excluir" 
        (click)="confirmarDelecao(row)">
        <mat-icon>delete</mat-icon>
      </button>
    </ng-template>
  `,
  styles: [`
    .consulta-lotes-container {
      padding: var(--spacing-sm);
      max-width: 100%;
      overflow-x: auto;
      position: relative;
    }
    
    .loading-indicator {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(255, 255, 255, 0.95);
      padding: var(--spacing-md);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-sm);
      z-index: 1000;
      min-width: 200px;
    }
    
    .loading-text {
      color: var(--color-text-primary);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
    }
    
    .button-spinner {
      margin-right: var(--spacing-xs);
    }
    
    .button-spinner ::ng-deep circle {
      stroke: currentColor;
    }
    
    .result-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-sm);
      padding: var(--spacing-sm);
      background-color: var(--color-background-light);
      border-radius: var(--radius-sm);
      font-size: var(--font-size-sm);
    }
    
    .result-header .title {
      font-weight: var(--font-weight-semibold);
      color: var(--color-primary-600);
    }
    
    .result-header .code {
      color: var(--color-text-secondary);
      font-size: var(--font-size-xs);
    }
    
    .header-actions {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }
    
    .result-header .total {
      font-weight: var(--font-weight-semibold);
      color: var(--color-primary-600);
      font-size: var(--font-size-sm);
    }
    
    /* Botões de ação */
    .btn-estrutura {
      background-color: #ff9800 !important;
      color: white !important;
      width: 32px !important;
      height: 32px !important;
      min-width: 32px !important;
    }
    
    .btn-uso {
      background-color: #4caf50 !important;
      color: white !important;
      width: 32px !important;
      height: 32px !important;
      min-width: 32px !important;
    }
    
    .btn-pessoas {
      background-color: #2196f3 !important;
      color: white !important;
      width: 32px !important;
      height: 32px !important;
      min-width: 32px !important;
    }
    
    .btn-endereco {
      background-color: #9c27b0 !important;
      color: white !important;
      width: 32px !important;
      height: 32px !important;
      min-width: 32px !important;
    }
    
    .btn-imovel {
      background-color: #607d8b !important;
      color: white !important;
      width: 32px !important;
      height: 32px !important;
      min-width: 32px !important;
    }
    
    .btn-excluir {
      background-color: #f44336 !important;
      color: white !important;
      width: 32px !important;
      height: 32px !important;
      min-width: 32px !important;
    }
    
    .spacer {
      flex: 1 1 auto;
    }
    
    /* Responsividade */
    @media (max-width: 1200px) {
      .consulta-lotes-container {
        padding: var(--spacing-xs);
      }
      
      .form-grid {
        grid-template-columns: repeat(2, 1fr) !important;
        gap: var(--spacing-sm) !important;
      }
      
      .col-3 {
        grid-column: span 6 !important;
      }
    }
    
    @media (max-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr !important;
      }
      
      .col-3 {
        grid-column: span 12 !important;
      }
      
      .result-header {
        flex-direction: column;
        gap: var(--spacing-xs);
        text-align: center;
      }
      
      .header-actions {
        flex-direction: column;
        gap: var(--spacing-xs);
      }
      
      .actions {
        flex-direction: column;
        gap: var(--spacing-xs);
      }
    }
  `]
})
export class ConsultaLotesComponent implements OnInit {
  filtrosForm: FormGroup;
  isLoading = false;
  listaLotes: LoteTableData[] = [];
  total = 0;
  municipios: Municipio[] = [];
  situacoes: SituacaoJuridica[] = [];
  municipioSelecionadoNome = '';
  
  loteColumns = [
    { key: 'numero', label: 'Código do Imóvel', sortable: true },
    { key: 'proprietario', label: 'Detentor', sortable: true },
    { key: 'denominacaoImovel', label: 'Denominação do Imóvel', sortable: true },
    { key: 'area', label: 'Área', sortable: true },
    { key: 'situacaoJuridicaNome', label: 'Situação Jurídica', sortable: true }
  ];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute, // Adicionar ActivatedRoute
    private loteService: LoteService,
    private municipioService: MunicipioService,
    private situacaoJuridicaService: SituacaoJuridicaService,
    private exportacaoDpService: ExportacaoDpService
  ) {
    this.filtrosForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadMunicipios();
    this.loadSituacoes().then(() => {
      // Verificar se há loteId nos query parameters
      this.route.queryParams.subscribe(params => {
        const loteId = params['loteId'];
        if (loteId) {
          // Carregar lote específico
          this.carregarLoteEspecifico(+loteId);
        } else {
          // Carregar todos os lotes
          this.loadLotes();
        }
      });
    }).catch((error) => {
      console.error('Erro ao carregar situações:', error);
      // Mesmo com erro, tenta carregar os lotes
      this.loadLotes();
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      numero: [''],
      proprietario: [''],
      municipioId: [''],
      situacaoJuridicaId: [''],
      denominacaoImovel: ['']
    });
  }

  private loadMunicipios(): void {
    this.municipioService.getMunicipiosCe().subscribe({
      next: (municipios) => {
        this.municipios = municipios;
      },
      error: (error) => {
        console.error('Erro ao carregar municípios:', error);
        this.snackBar.open('Erro ao carregar municípios', 'Fechar', { duration: 3000 });
      }
    });
  }

  private loadSituacoes(): Promise<void> {
    return new Promise((resolve) => {
      // Usar dados estáticos como no cadastro-lotes
      this.situacoes = [
        { id: 1, nome: 'Posse Por Simples Ocupação', lotes: [] },
        { id: 2, nome: 'Posse a Justo Título', lotes: [] },
        { id: 3, nome: 'Área Registrada (Domínio)', lotes: [] },
        { id: 99, nome: 'Indefinido', lotes: [] }
      ];
      resolve();
    });
  }

  private loadLotes(): void {
    this.isLoading = true;
    this.loteService.obterTodos().subscribe({
      next: (lotes) => {
        // Adicionar situação jurídica formatada
        this.listaLotes = lotes.map(lote => ({
          ...lote,
          situacaoJuridicaNome: this.situacaoNome(lote.situacaoJuridicaId)
        }));
        this.total = lotes.length;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar lotes:', error);
        this.snackBar.open('Erro ao carregar lotes', 'Fechar', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  private carregarLoteEspecifico(loteId: number): void {
    this.isLoading = true;
    this.loteService.obterPorId(loteId).subscribe({
      next: (lote) => {
        // Adicionar situação jurídica formatada
        const loteComSituacao = {
          ...lote,
          situacaoJuridicaNome: this.situacaoNome(lote.situacaoJuridicaId)
        };
        
        this.listaLotes = [loteComSituacao];
        this.total = 1;
        this.isLoading = false;
        
        // Preencher os filtros com os dados do lote para mostrar na interface
        this.filtrosForm.patchValue({
          numero: lote.numero,
          proprietario: lote.proprietario,
          municipioId: lote.municipioId,
          situacaoJuridicaId: lote.situacaoJuridicaId,
          denominacaoImovel: lote.denominacaoImovel
        });
        
        this.snackBar.open(`Lote ${lote.numero} carregado com sucesso!`, 'Fechar', { duration: 3000 });
      },
      error: (error) => {
        console.error('Erro ao carregar lote específico:', error);
        this.snackBar.open('Erro ao carregar lote específico', 'Fechar', { duration: 3000 });
        this.isLoading = false;
        // Em caso de erro, carregar todos os lotes
        this.loadLotes();
      }
    });
  }

  pesquisar(): void {
    this.isLoading = true;
    const filtros: LoteFiltroDTO = this.filtrosForm.value;
    
    // Atualizar nome do município selecionado
    if (filtros.municipioId) {
      const municipio = this.municipios.find(m => m.id === filtros.municipioId);
      this.municipioSelecionadoNome = municipio ? municipio.nome : '';
    } else {
      this.municipioSelecionadoNome = '';
    }
    
    this.loteService.filtrarLotes(filtros).subscribe({
      next: (lotes) => {
        // Adicionar situação jurídica formatada
        this.listaLotes = lotes.map(lote => ({
          ...lote,
          situacaoJuridicaNome: this.situacaoNome(lote.situacaoJuridicaId)
        }));
        this.total = lotes.length;
        this.isLoading = false;
        this.snackBar.open('Busca realizada com sucesso!', 'Fechar', { duration: 3000 });
      },
      error: (error) => {
        console.error('Erro ao buscar lotes:', error);
        this.snackBar.open('Erro ao buscar lotes', 'Fechar', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  abrirBuscaAvancada(): void {
    // Implementar busca avançada
    this.snackBar.open('Funcionalidade de busca avançada em desenvolvimento', 'Fechar', { duration: 3000 });
  }

  novoImovel(): void {
    this.router.navigate(['/cadastro-lotes']);
  }

  onExportarMunicipio(municipioId: number): void {
    if (!municipioId) {
      this.snackBar.open('Selecione um município para exportar', 'Fechar', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    this.exportacaoDpService.exportarMunicipioXml(municipioId)
      .then(() => {
        this.isLoading = false;
        this.snackBar.open('XML exportado com sucesso!', 'Fechar', { duration: 3000 });
      })
      .catch((error) => {
        this.isLoading = false;
        console.error('Erro ao exportar XML:', error);
        this.snackBar.open('Erro ao exportar XML', 'Fechar', { duration: 3000 });
      });
  }

  preparaEditarEstrutura(loteId: number): void {
    this.router.navigate(['/cadastro-estrutura'], { 
      queryParams: { loteId: loteId } 
    });
  }

  preparaEditarLote(loteId: number): void {
    this.router.navigate(['/cadastro-lotes'], { 
      queryParams: { id: loteId, mode: 'edit' } 
    });
  }

  preparaEditarDadosPessoais(loteId: number): void {
    this.router.navigate(['/cadastro-pessoas'], { 
      queryParams: { loteId: loteId } 
    });
  }

  preparaEditarDadosUso(loteId: number): void {
    this.router.navigate(['/cadastro-dados-sobre-uso'], { 
      queryParams: { loteId: loteId } 
    });
  }

  preparaEditarEnderecoLote(loteId: number): void {
    this.router.navigate(['/cadastro-endereco-lote'], { 
      queryParams: { loteId: loteId } 
    });
  }

  confirmarDelecao(lote: LoteDTO): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmar Exclusão',
        message: `Tem certeza que deseja excluir o lote ${lote.numero}?`,
        type: 'warning',
        confirmText: 'Excluir',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && lote.id) {
        this.isLoading = true;
      this.loteService.deletar(lote.id).subscribe({
        next: () => {
            this.isLoading = false;
            this.snackBar.open('Lote excluído com sucesso!', 'Fechar', { duration: 3000 });
            this.loadLotes();
          },
          error: (error) => {
            console.error('Erro ao excluir lote:', error);
            this.snackBar.open('Erro ao excluir lote', 'Fechar', { duration: 3000 });
            this.isLoading = false;
          }
        });
      }
    });
  }

  situacaoNome(situacaoJuridicaId: number | null | undefined): string {
    if (!situacaoJuridicaId || this.situacoes.length === 0) {
      return 'Não informado';
    }
    const situacao = this.situacoes.find(s => s.id === situacaoJuridicaId);
    return situacao ? situacao.nome : 'Não encontrado';
  }

  trackBySituacao(index: number, situacao: SituacaoJuridica): number {
    return situacao.id;
  }
}
