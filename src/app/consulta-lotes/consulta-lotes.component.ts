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
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ActivatedRoute } from '@angular/router';

// Importando os componentes reutilizáveis
import { FormFieldComponent } from '../shared/components/form-field/form-field.component';
import { CardComponent } from '../shared/components/card/card.component';
import { DataTableComponent } from '../shared/components/data-table/data-table.component';

// Importando os serviços
import { LoteService, LoteFiltroDTO } from '../services/lote.service';
import { MunicipioService } from '../services/municipio.service';
import { SituacaoJuridicaService } from '../services/situacao-juridica.service';
import { ExportacaoDpService } from '../exportacao-dp/exportacao-dp.service';
import { LoteDeleteService } from '../services/lote-delete.service';

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
    MatTableModule,
    MatCardModule,
    MatPaginatorModule,
    MatCheckboxModule
  ],
  templateUrl: './consulta-lotes.component.html',
  styleUrls: ['./consulta-lotes.component.scss']
})
export class ConsultaLotesComponent implements OnInit {
  filtrosForm: FormGroup;
  isLoading = false;
  listaLotes: LoteTableData[] = [];
  total = 0;
  municipios: Municipio[] = [];
  situacoes: SituacaoJuridica[] = [];
  municipioSelecionadoNome = '';
  
  // Propriedades para seleção de lotes
  lotesSelecionados = new Set<number>();
  todosSelecionados = false;
  municipioIdSelecionado: number | null = null;
  
  loteColumns = [
    { key: 'numero', label: 'Código do Imóvel', sortable: true },
    { key: 'proprietario', label: 'Detentor', sortable: true },
    { key: 'denominacaoImovel', label: 'Denominação do Imóvel', sortable: true },
    { key: 'area', label: 'Área', sortable: true },
    { key: 'situacaoJuridicaNome', label: 'Situação Jurídica', sortable: true }
  ];

  // Colunas da tabela Material para o template HTML
  displayedColumns: string[] = [
    'selecao',
    'numero',
    'proprietario', 
    'denominacaoImovel',
    'area',
    'situacao',
    'acoes'
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
    private exportacaoDpService: ExportacaoDpService,
    private loteDeleteService: LoteDeleteService
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
    
    // Monitora mudanças no filtro de município
    this.filtrosForm.get('municipioId')?.valueChanges.subscribe(municipioId => {
      this.municipioIdSelecionado = municipioId;
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
    
    // Captura o município selecionado
    const municipioId = this.filtrosForm.get('municipioId')?.value;
    this.municipioIdSelecionado = municipioId;
    
    this.loteService.obterTodos().subscribe({
      next: (lotes) => {
        console.log('🔍 Lotes retornados pela API:', lotes);
        
        if (lotes && lotes.length > 0) {
          console.log('🔍 Primeiro lote completo:', lotes[0]);
          console.log('🔍 Campos do primeiro lote:', Object.keys(lotes[0]));
          console.log('🔍 Valores específicos:', {
            id: lotes[0].id,
            numero: lotes[0].numero,
            proprietario: lotes[0].proprietario,
            denominacaoImovel: lotes[0].denominacaoImovel,
            area: lotes[0].area,
            situacaoJuridicaId: lotes[0].situacaoJuridicaId,
            municipioId: lotes[0].municipioId,
            distritoId: lotes[0].distritoId,
            cpf: lotes[0].cpf,
            perimetro: lotes[0].perimetro,
            dataTerminoPeriodoDeUso: lotes[0].dataTerminoPeriodoDeUso
          });
        } else {
          console.log('ℹ️ Nenhum lote encontrado na API');
        }
        
        // Adicionar situação jurídica formatada e tratar campos nulos
        this.listaLotes = (lotes || []).map(lote => ({
          ...lote,
          situacaoJuridicaNome: this.situacaoNome(lote.situacaoJuridicaId),
          // Tratar campos nulos para exibição
          denominacaoImovel: lote.denominacaoImovel || 'Não informado',
          proprietario: lote.proprietario || 'Não informado',
          cpf: lote.cpf || 'Não informado',
          perimetro: lote.perimetro || 0,
          dataTerminoPeriodoDeUso: lote.dataTerminoPeriodoDeUso || 'Não informado'
        }));
        
        console.log('🔍 Lotes processados para exibição:', this.listaLotes);
        if (this.listaLotes.length > 0) {
          console.log('🔍 Primeiro lote processado:', this.listaLotes[0]);
        } else {
          console.log('ℹ️ Lista de lotes vazia após processamento');
        }
        
        this.total = (lotes || []).length;
        this.isLoading = false;
        
        // Limpa a seleção quando os dados mudam
        this.limparSelecao();
      },
      error: (error) => {
        console.error('Erro ao carregar lotes:', error);
        this.snackBar.open('Erro ao carregar lotes', 'Fechar', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  private limparSelecao(): void {
    this.lotesSelecionados.clear();
    this.todosSelecionados = false;
  }

  private carregarLoteEspecifico(loteId: number): void {
    this.isLoading = true;
    this.loteService.obterPorId(loteId).subscribe({
      next: (lote) => {
        console.log('🔍 Lote específico retornado pela API:', lote);
        if (lote) {
          console.log('🔍 Campos do lote:', Object.keys(lote));
          console.log('🔍 Valores dos campos:', Object.values(lote));
        } else {
          console.log('ℹ️ Lote não encontrado');
        }
        
        // Adicionar situação jurídica formatada e tratar campos nulos
        if (!lote) {
          console.log('ℹ️ Lote não encontrado, inicializando com lista vazia');
          this.listaLotes = [];
          this.total = 0;
          this.isLoading = false;
          return;
        }
        
        const loteComSituacao = {
          ...lote,
          situacaoJuridicaNome: this.situacaoNome(lote.situacaoJuridicaId),
          // Tratar campos nulos para exibição
          denominacaoImovel: lote.denominacaoImovel || 'Não informado',
          proprietario: lote.proprietario || 'Não informado',
          cpf: lote.cpf || 'Não informado',
          perimetro: lote.perimetro || 0,
          dataTerminoPeriodoDeUso: lote.dataTerminoPeriodoDeUso || 'Não informado'
        };
        
        console.log('🔍 Lote com situação jurídica:', loteComSituacao);
        
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
        // Adicionar situação jurídica formatada e tratar campos nulos
        this.listaLotes = (lotes || []).map(lote => ({
          ...lote,
          situacaoJuridicaNome: this.situacaoNome(lote.situacaoJuridicaId),
          // Tratar campos nulos para exibição
          denominacaoImovel: lote.denominacaoImovel || 'Não informado',
          proprietario: lote.proprietario || 'Não informado',
          cpf: lote.cpf || 'Não informado',
          perimetro: lote.perimetro || 0,
          dataTerminoPeriodoDeUso: lote.dataTerminoPeriodoDeUso || 'Não informado'
        }));
        this.total = (lotes || []).length;
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

  voltar(): void {
    window.history.back();
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

  // --------------------------
  // Métodos para seleção de lotes
  // --------------------------

  onSelecionarTodos(): void {
    if (this.todosSelecionados) {
      this.lotesSelecionados.clear();
      this.todosSelecionados = false;
    } else {
      this.listaLotes.forEach(lote => {
        if (lote.id) {
          this.lotesSelecionados.add(lote.id);
        }
      });
      this.todosSelecionados = true;
    }
  }

  onSelecionarLote(loteId: number | undefined): void {
    if (!loteId) return;

    if (this.lotesSelecionados.has(loteId)) {
      this.lotesSelecionados.delete(loteId);
    } else {
      this.lotesSelecionados.add(loteId);
    }

    // Atualiza o estado do checkbox "Selecionar Todos"
    this.todosSelecionados = this.lotesSelecionados.size === this.listaLotes.length;
  }

  isLoteSelecionado(loteId: number | undefined): boolean {
    return loteId ? this.lotesSelecionados.has(loteId) : false;
  }

  getQuantidadeLotesSelecionados(): number {
    return this.lotesSelecionados.size;
  }

  getCodigosImoveisSelecionados(): string {
    if (this.lotesSelecionados.size === 0) {
      return 'Nenhum lote selecionado';
    }
    
    const codigos = this.listaLotes
      .filter(lote => lote.id && this.lotesSelecionados.has(lote.id))
      .map(lote => lote.numero)
      .join(', ');
    
    return codigos;
  }

  onExportarLotesSelecionados(): void {
    if (this.lotesSelecionados.size === 0) {
      this.snackBar.open('Selecione pelo menos um lote para exportar', 'Fechar', { duration: 3000 });
      return;
    }

    if (!this.municipioIdSelecionado) {
      this.snackBar.open('Selecione um município para exportar', 'Fechar', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    const loteIds = Array.from(this.lotesSelecionados);
    
    this.exportacaoDpService.exportarLotesXml(this.municipioIdSelecionado, loteIds)
      .then(() => {
        this.isLoading = false;
        this.snackBar.open(`XML exportado com sucesso para ${loteIds.length} lote(s)!`, 'Fechar', { duration: 3000 });
      })
      .catch((error) => {
        this.isLoading = false;
        console.error('Erro ao exportar XML dos lotes selecionados:', error);
        this.snackBar.open('Erro ao exportar XML', 'Fechar', { duration: 3000 });
      });
  }

  preparaEditarEstrutura(loteId: number | undefined): void {
    if (loteId) {
      this.router.navigate(['/cadastro-estrutura'], { 
        queryParams: { loteId: loteId } 
      });
    }
  }

  preparaEditarLote(loteId: number | undefined): void {
    if (loteId) {
      this.router.navigate(['/cadastro-lotes'], { 
        queryParams: { loteId: loteId, mode: 'edit' } 
      });
    }
  }

  preparaEditarDadosPessoais(loteId: number | undefined): void {
    if (loteId) {
      this.router.navigate(['/cadastro-pessoas'], { 
        queryParams: { loteId: loteId } 
      });
    }
  }

  preparaEditarDadosUso(loteId: number | undefined): void {
    if (loteId) {
      this.router.navigate(['/cadastro-dados-sobre-uso'], { 
        queryParams: { loteId: loteId } 
      });
    }
  }

  preparaEditarEnderecoLote(loteId: number): void {
    this.router.navigate(['/cadastro-endereco-lote'], { 
      queryParams: { loteId: loteId } 
    });
  }

  confirmarDelecao(lote: LoteDTO): void {
    const confirmMessage = `Tem certeza que deseja excluir o lote ${lote.numero}? Esta ação irá deletar todos os dados relacionados ao lote (pessoas, estruturas, dados de uso, etc.) e não pode ser desfeita.`;
    
    if (confirm(confirmMessage) && lote.id) {
      this.isLoading = true;
      this.loteDeleteService.deletarLoteCompleto(lote.id).subscribe({
        next: () => {
          this.isLoading = false;
          this.snackBar.open(`Lote ${lote.numero} excluído com sucesso!`, 'Fechar', { duration: 3000 });
          this.loadLotes();
        },
        error: (error) => {
          console.error('Erro ao excluir lote:', error);
          this.snackBar.open('Erro ao excluir lote. Tente novamente.', 'Fechar', { duration: 3000 });
          this.isLoading = false;
        }
      });
    }
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
