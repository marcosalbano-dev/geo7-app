import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { BackButtonComponent } from '../shared/components/back-button/back-button.component';

import { LoteDTO } from '../models/lote-dto';
import { Municipio } from '../models/municipio';
import { Distrito } from '../models/distrito';

import { MunicipioService } from '../services/municipio.service';
import { LoteService } from '../services/lote.service';
import { DistritoService } from '../services/distrito.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { SituacaoJuridicaService } from '../services/situacao-juridica.service';
import { mapFormToLoteDTO, mapLoteDTOToForm } from '../helpers/lote-mapper';

import { Location } from '@angular/common';


@Component({
  selector: 'app-cadastro-lotes',
  templateUrl: './cadastro-lotes.component.html',
  styleUrl: './cadastro-lotes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FlexLayoutModule,
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatDividerModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    NgxMatSelectSearchModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    CommonModule,
    BackButtonComponent
]
})
export class CadastroLotesComponent implements OnInit {

  loteSelecionado!: LoteDTO;

  preencherEstruturaComLote(lote: LoteDTO) {
    this.loteSelecionado = lote;
  }

  errorStateMatcher: ErrorStateMatcher = {
    isErrorState: (control) => !!(control && control.invalid && control.touched),
  };

  formLotes!: FormGroup;

  municipios: Municipio[] = [];
  distritos: Distrito[] = [];
  filteredDistritos: Distrito[] = [];
  lotes: LoteDTO[] = [];

  isLoadingDistrito = false;
  isLoadingMunicipio = false;

  atualizando = false;
  numeroLote: string = '';

  /** Modo edição é derivado do form (se tem id, atualiza) */
  get isAtualizando(): boolean {
    return !!this.formLotes?.get('id')?.value;
  }

  /** Carrega o número do lote para exibição */
  private carregarNumeroLote(loteId: number): void {
    this.loteService.obterPorId(loteId).subscribe({
      next: (lote) => {
        this.numeroLote = lote.numero || `Lote ${loteId}`;
      },
      error: (err) => {
        console.warn('[Lotes] Erro ao carregar número do lote:', err);
        this.numeroLote = `Lote ${loteId}`;
      }
    });
  }

  situacoes = [
    { value: 1, viewValue: 'Posse Por Simples Ocupação' },
    { value: 2, viewValue: 'Posse a Justo Título' },
    { value: 3, viewValue: 'Área Registrada (Domínio)' },
    { value: 99, viewValue: 'Indefinido' }
  ];

  constructor(
    private fb: FormBuilder,
    private municipioService: MunicipioService,
    private loteService: LoteService,
    private situacaoService: SituacaoJuridicaService,
    private distritoService: DistritoService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location// Captura dados da rota que foi acessada
  ) { }

  ngOnInit(): void {
    // Formulário completo com todos os campos obrigatórios
    this.formLotes = this.fb.group({
      id: [null],
      numero: ['', Validators.required], // Controle de Campo - OBRIGATÓRIO
      municipioId: [null, Validators.required], // OBRIGATÓRIO
      distritoId: [null, Validators.required], // OBRIGATÓRIO
      situacaoJuridicaId: [null, Validators.required], // OBRIGATÓRIO
      area: [null, [Validators.required, Validators.min(0.01)]], // OBRIGATÓRIO - deve ser maior que zero
      proprietario: ['', Validators.required], // OBRIGATÓRIO
      cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]], // OBRIGATÓRIO com validação de CPF
      
      // Campos opcionais
      perimetro: [null],
      dataTerminoPeriodoDeUso: [''],
      situacaoJuridicaNome: [''],
      nomeDistrito: [''],
      denominacaoImovel: [''], // ✅ ADICIONADO
      sncr: [''], // ✅ ADICIONADO
    });
    console.log('✅ formLotes inicializado:', this.formLotes);

    // Carregar dados básicos
    this.loadMunicipiosCe();
    this.carregarLotes();

    // Verificar se há ID ou loteId para edição
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      const loteId = params['loteId']; // Adicionar verificação de loteId
      
      console.log('🔍 Parâmetros da URL:', params);
      console.log('🔍 ID encontrado:', id);
      console.log('🔍 LoteId encontrado:', loteId);
      
      // Priorizar loteId se ambos estiverem presentes
      const idParaCarregar = loteId || id;
      
      if (idParaCarregar) {
        this.atualizando = true;
        console.log('🔄 Modo de edição ativado para ID:', idParaCarregar);
        this.carregarNumeroLote(+idParaCarregar);
        // Aguardar municípios carregarem antes de carregar o lote
        this.loadMunicipiosCe().then(() => {
          this.carregarLotePorId(+idParaCarregar);
        });
      }
    });

    // Configurar mudanças no município
    this.formLotes.get('municipioId')?.valueChanges.subscribe((municipioId) => {
      if (municipioId) {
        this.loadDistritosByMunicipio(municipioId);
      } else {
        this.filteredDistritos = [];
        this.formLotes.get('distritoId')?.reset();
      }
    });
  }


  carregarLotePorId(id: number) {
    console.log('🔄 Carregando lote com ID:', id);
    this.loteService.obterPorId(id).subscribe({
      next: (loteDto: LoteDTO) => {
        this.loteSelecionado = loteDto;
        console.log('✅ Lote carregado:', loteDto);

        // Carregar distritos do município do lote
        this.loadDistritosByMunicipio(loteDto.municipioId).then(() => {
          const formPatch = mapLoteDTOToForm(loteDto);
          console.log('🔄 Aplicando dados ao formulário:', formPatch);
          this.formLotes.patchValue(formPatch);
          console.log('✅ Formulário atualizado com dados do lote');
        });
      },
      error: (err) => {
        console.error('❌ Erro ao buscar lote:', err);
        this.snackBar.open('Erro ao carregar dados do lote', 'Fechar', { duration: 3000 });
      }
    });
  }

  onSubmit(): void {
    console.log('Valid:', this.formLotes.valid);
    console.log('Form Value:', this.formLotes.value);
    
    // Debug: mostrar quais campos estão inválidos
    if (!this.formLotes.valid) {
      console.log('❌ Campos inválidos:');
      Object.keys(this.formLotes.controls).forEach(key => {
        const control = this.formLotes.get(key);
        if (control && control.invalid) {
          console.log(`- ${key}:`, control.errors);
        }
      });
    }

    if (this.formLotes.valid) {
      this.salvarLote();
    } else {
      this.formLotes.markAllAsTouched();
      this.snackBar.open('Preencha todos os campos obrigatórios.', 'Fechar', { duration: 3000 });
    }
  }

  salvarLote(): void {
    const formValue = this.formLotes.value;
    console.log('🔍 Form Value antes do mapeamento:', formValue);
    console.log('🔍 Modo atualizando:', this.atualizando);
    console.log('🔍 situacaoJuridicaId no form:', formValue.situacaoJuridicaId);
    
    // Garantir que não temos ID para novo lote
    if (!this.atualizando) {
      formValue.id = null;
    }
    
    const loteDTO = mapFormToLoteDTO(formValue);
    console.log('🔄 LoteDTO após mapeamento:', loteDTO);
    console.log('🔄 LoteDTO JSON:', JSON.stringify(loteDTO, null, 2));
    console.log('🔍 situacaoJuridicaId no DTO:', loteDTO.situacaoJuridicaId);

    this.loteService.salvar(loteDTO).subscribe({
      next: (saved) => {
        this.snackBar.open('Lote cadastrado com sucesso!', 'Fechar', { duration: 3000 });
        console.log('🚦 Lote salvo:', saved);
        
        // Navegar para cadastro de estrutura com dados do lote
        this.router.navigate(['/cadastro-estrutura'], {
          queryParams: {
            loteId: saved.id,
            numero: saved.numero,
            municipioId: saved.municipioId,
            distritoId: saved.distritoId,
            situacaoJuridicaId: saved.situacaoJuridicaId,
            area: saved.area,
            proprietario: saved.proprietario,
            cpf: saved.cpf,
            perimetro: saved.perimetro,
            dataTerminoPeriodoDeUso: saved.dataTerminoPeriodoDeUso,
            denominacaoImovel: saved.denominacaoImovel, // ✅ ADICIONADO
            sncr: saved.sncr // ✅ ADICIONADO
          }
        });
      },
      error: (err) => {
        console.error('❌ Erro ao salvar lote:', err);
        console.error('❌ Status do erro:', err.status);
        console.error('❌ Mensagem do erro:', err.error);
        console.error('❌ Dados enviados:', loteDTO);
        console.error('❌ Dados enviados JSON:', JSON.stringify(loteDTO, null, 2));
        this.snackBar.open('Erro ao salvar lote. Verifique os dados e tente novamente.', 'Fechar', { duration: 4000 });
      }
    });
  }

  atualizarLote() {
    console.log('Valid:', this.formLotes.valid);
    console.log('Form Value:', this.formLotes.value);
    
    // Debug: mostrar quais campos estão inválidos
    if (!this.formLotes.valid) {
      console.log('❌ Campos inválidos:');
      Object.keys(this.formLotes.controls).forEach(key => {
        const control = this.formLotes.get(key);
        if (control && control.invalid) {
          console.log(`- ${key}:`, control.errors);
        }
      });
    }

    if (this.formLotes.valid) {
      const formValue = this.formLotes.value;
      console.log('🔍 Form Value antes do mapeamento:', formValue);
      console.log('🔍 Modo atualizando:', this.atualizando);
      console.log('🔍 situacaoJuridicaId no form:', formValue.situacaoJuridicaId);
      
      const loteDTO = mapFormToLoteDTO(formValue);
      console.log('🔄 LoteDTO após mapeamento:', loteDTO);
      console.log('🔄 LoteDTO JSON:', JSON.stringify(loteDTO, null, 2));
      console.log('🔍 situacaoJuridicaId no DTO:', loteDTO.situacaoJuridicaId);

      if (loteDTO.id) {
        this.loteService.atualizar(loteDTO.id, loteDTO).subscribe({
          next: (res) => {
            this.snackBar.open('Lote atualizado com sucesso!', 'Fechar', { duration: 3000 });
            console.log('🚦 Lote atualizado:', res);
            
            // Navegar para cadastro de estrutura com dados atualizados do lote
            // this.router.navigate(['/cadastro-estrutura'], {
            //   queryParams: {
            //     loteId: loteDTO.id,
            //     numero: loteDTO.numero,
            //     municipioId: loteDTO.municipioId,
            //     distritoId: loteDTO.distritoId,
            //     situacaoJuridicaId: loteDTO.situacaoJuridicaId,
            //     area: loteDTO.area,
            //     proprietario: loteDTO.proprietario,
            //     cpf: loteDTO.cpf,
            //     perimetro: loteDTO.perimetro,
            //     dataTerminoPeriodoDeUso: loteDTO.dataTerminoPeriodoDeUso,
            //     denominacaoImovel: loteDTO.denominacaoImovel, // ✅ ADICIONADO
            //     sncr: loteDTO.sncr // ✅ ADICIONADO
            //   }
            // });
          },
          error: (err) => {
            console.error('❌ Erro ao atualizar lote:', err);
            console.error('❌ Status do erro:', err.status);
            console.error('❌ Mensagem do erro:', err.error);
            console.error('❌ Dados enviados:', loteDTO);
            console.error('❌ Dados enviados JSON:', JSON.stringify(loteDTO, null, 2));
            this.snackBar.open('Erro ao atualizar lote. Verifique os dados e tente novamente.', 'Fechar', { duration: 4000 });
          }
        });
      } else {
        console.error('❌ ID do lote não encontrado no formulário');
        this.snackBar.open('ID do lote não encontrado. Não é possível atualizar.', 'Fechar', { duration: 3000 });
      }
    } else {
      this.formLotes.markAllAsTouched();
      this.snackBar.open('Preencha todos os campos obrigatórios.', 'Fechar', { duration: 3000 });
    }
  }

  carregarLotes(): void {
    this.loteService.obterTodos().subscribe({
      next: (lotes: LoteDTO[]) => {
        this.lotes = lotes;
        console.log('📦 Lotes carregados:', lotes);
      },
      error: (err) => console.error('Erro ao carregar lotes:', err)
    });
  }

  loadMunicipiosCe(): Promise<void> {
    this.isLoadingMunicipio = true;
    return new Promise((resolve, reject) => {
      this.municipioService.getMunicipiosCe().subscribe({
        next: (data) => {
          this.municipios = data;
          this.isLoadingMunicipio = false;
          resolve();
        },
        error: (err) => {
          console.error('Erro ao carregar municípios:', err);
          this.isLoadingMunicipio = false;
          reject();
        }
      });
    });
  }

  loadDistritosByMunicipio(municipioId: number): Promise<void> {
    this.isLoadingDistrito = true;
    return new Promise((resolve, reject) => {
      this.distritoService.getDistritosByMunicipio(municipioId).subscribe({
        next: (distritos) => {
          this.filteredDistritos = distritos;
          this.isLoadingDistrito = false;
          resolve();
        },
        error: () => {
          this.filteredDistritos = [];
          this.isLoadingDistrito = false;
          reject();
        }
      });
    });
  }

  onDelete(): void {
    const id = this.formLotes.get('id')?.value as number | null;
    if (!id) return;
    if (!confirm('Remover este imóvel?')) return;

    this.loteService.deletar(id).subscribe({
      next: () => {
        this.snackBar.open('Imóvel removido.', 'Fechar', { duration: 3000 });
        this.formLotes.reset({ loteId: this.formLotes.get('loteId')?.value });
      },
      error: () => this.snackBar.open('Erro ao remover.', 'Fechar', { duration: 4000 }),
    });
  }

  limparFormulario(): void {
    this.formLotes.reset();
  }

  onVoltarClick(): void {
    // Lógica customizada antes de voltar
    const loteId = this.formLotes.get('id')?.value; // Corrigir: usar 'id' em vez de 'loteId'
    
    if (loteId) {
      // Navega para a página de consulta de lotes com o loteId específico
      this.router.navigate(['/consulta-lotes'], { 
        queryParams: { loteId: loteId } 
      });
    } else {
      // Volta para a página anterior
      this.location.back();
    }
  }
}
