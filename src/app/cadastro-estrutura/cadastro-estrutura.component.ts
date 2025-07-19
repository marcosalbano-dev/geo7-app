import { ChangeDetectionStrategy, Component, ChangeDetectorRef, Input, OnInit } from '@angular/core';
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
import { LoteDTO } from '../models/lote-dto';
import { Municipio } from '../models/municipio';
import { MunicipioService } from '../services/municipio.service';
import { EstruturaService } from '../services/estrutura.service';
import { DistritoService } from '../services/distrito.service';
import { EnderecoLoteService } from '../services/endereco-lote.service';
import { LoteService } from '../services/lote.service';
import { Distrito } from '../models/distrito';
import { NgFor } from '@angular/common'
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { EstruturaDTO } from '../models/estrutura-dto';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CadastroSituacaoJuridicaComponent } from "../cadastro-situacao-juridica/cadastro-situacao-juridica.component";
import { SituacaoJuridicaEnum } from '../enums/enums-cadastramento';
import { EnderecoLoteDTO } from '../models/endereco-lote-dto';
import { mapFormToEstruturaDTO } from '../helpers/estrutura-mapper';
import { enderecoLoteDTOToFormValue, mapFormToEnderecoLoteDTO } from '../helpers/endereco-lote-mapper'; 


interface destinacaoDoImovel {
  value: string;
  viewValue: string;
}

interface litigio {
  value: string;
  viewValue: string;
}

interface energia {
  value: string;
  viewValue: string;
}

interface usoDaAgua {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-cadastro-estrutura',
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
    NgFor,
    NgxMatSelectSearchModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    CommonModule,
    CadastroSituacaoJuridicaComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cadastro-estrutura.component.html',
  styleUrl: './cadastro-estrutura.component.scss'
})
export class CadastroEstruturaComponent implements OnInit {

  formEstrutura!: FormGroup;
  formEnderecoLote!: FormGroup;

  municipios: Municipio[] = [];
  isLoadingMunicipio = false;

  filteredDistritos: Distrito[] = [];
  isLoadingDistrito = false;

  lotes: LoteDTO[] = [];
  lotesFiltrados: LoteDTO[] = [];
  loteSelecionado!: LoteDTO;
  numeroLote: string | null = null;

  atualizando = false;

  preencherPessoasComLote(lote: LoteDTO) {
    this.loteSelecionado = lote;
  }

  onMunicipioChange(municipioId: number): void {
    this.loadDistritosByMunicipio(municipioId);
    this.lotesFiltrados = this.lotes.filter(l => l.municipioId === municipioId);
    console.log('📌 Lotes filtrados:', this.lotesFiltrados);
  }

  constructor(
    private fb: FormBuilder,
    private loteService: LoteService,
    private municipioService: MunicipioService,
    private distritoService: DistritoService,
    private estruturaService: EstruturaService,
    private enderecoLoteService: EnderecoLoteService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {


  }

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      const loteId = params['id'];
      if (loteId) {
        this.atualizando = true;
        this.carregarEstruturaPorLoteId(loteId);
      }
    });

    
    console.log('Construindo formEstrutura...');
    // 1. Crie o form ANTES de qualquer coisa!
    this.formEstrutura = this.fb.group({
      id: [null],
      municipioId: [null, Validators.required],
      distritoId: [null, Validators.required],
      loteId: [null, Validators.required],
      numero: [''],
      denominacaoImovel: [''],
      situacaoSelecionada: [null, Validators.required],
      situacaoJuridicaNome: [''],
      formaObtencaoSelecionada: [null],
      dataPosse: [null],
      areaPosse: [null],
      livro: [''],
      areaRegistrada: [''],
      nomeCartorio: [''],
      municipioCartorio: [''],
      dataRegistro: [''],
      oficio: [''],
      matricula: [''],
      numeroRegistro: [''],
      codImoReceita: [''],
      comunidade: [''],
      localidade: [''],
      area: [null, Validators.required],
      sncr: [''],
      pontoReferencia: [''],
      familiasResidentes: [0],
      pessoasResidentes: [0],
      trabalhadoresComCarteira: [0],
      trabalhadoresSemCarteira: [0],
      valorTotal: [0],
      valorDasBenfeitorias: [0],
      valorOutrasAtividades: [0],
      valorTerraNua: [0],
      destinacaoDoImovel: [null],
      litigio: [null],
      entregouMemorialPlanilha: [false],
      isIrrigacao: [false],
      isFonteAguaExterna: [false],
      isRedeDeAbastecimento: [false],
      isAcude: [false],
      isAcudePerene: [false],
      usoDaguaAcude: [null],
      isLagoa: [false],
      isLagoaPerene: [false],
      usoDaguaLagoa: [null],
      isPoco: [false],
      isPocoPerene: [false],
      usoDaguaPoco: [null],
      isRioOuRiacho: [false],
      isRioOuRiachoPerene: [false],
      usoDaguaRioOuRiacho: [null],
      isOlhoDagua: [false],
      isOlhoDaguaPerene: [false],
      usoDaguaOlhoDagua: [null],
      isPossuiEnergiaAlternativa: [false],
      tipoEnergiaEletrica: [null]
    });

    console.log('Construindo formEnderecoLote...');
    this.formEnderecoLote = this.fb.group({
      id: [null],
      loteId: [null, Validators.required],
      ativo: [true],
      dhc: [null],
      dhm: [null],
      pontoDeReferencia: [''],
      codImoReceita: [''],
      areaUrbana: [0],
      distritoId: [null],
      comunidade: [''],
      localidade: [''],
    });

    console.log('Inicial:', this.formEstrutura.value);
    console.log('Situação selecionada:', this.formEstrutura.value.situacaoSelecionada);

    this.carregarMunicipios();

    // Guarde o valor do distrito vindo do params
    // let distritoIdParam: number | null = null;

    // Escuta params da rota
    this.route.queryParams.subscribe(params => {
      // Converta e valide
      const distritoIdParam = params['distritoId'] ? Number(params['distritoId']) : null;
      console.log('Param distritoId:', params['distritoId'], 'Convertido:', distritoIdParam);

      this.paramCache = params; // Cache para uso posterior
      // Aplica valores já disponíveis
      this.formEstrutura.patchValue({
        id: params['id'] ? +params['id'] : null,
        municipioId: params['municipioId'] ? +params['municipioId'] : null,
        loteId: params['loteId'] ? +params['loteId'] : null,
        numero: params['numero'] ? params['numero'] : '',   // normalmente string
        area: params['area'] ? +params['area'] : null,
        denominacaoImovel: params['denominacaoImovel'] || '',
        sncr: params['sncr'] ? params['sncr'] : '',
        situacaoJuridicaNome: params['situacaoJuridicaNome'] ? params['situacaoJuridicaNome'] : ''
      });

      // Só desabilite após patchValue!
      if (params['municipioId']) this.formEstrutura.get('municipioId')?.disable();
      if (params['numero']) this.formEstrutura.get('numero')?.disable();
      if (params['denominacaoImovel']) this.formEstrutura.get('denominacaoImovel')?.disable();

      console.log(this.filteredDistritos, this.formEstrutura.value.distritoId)

      // Carrega distritos SE tiver municipioId
      if (params['municipioId']) {
        this.distritoService.getDistritosByMunicipio(+params['municipioId']).subscribe(distritos => {
          this.filteredDistritos = distritos;
          console.log('Distritos carregados:', this.filteredDistritos, 'Vai patchar distrito:', distritoIdParam);
          // Só faz patch se o distrito existe!
          if (distritoIdParam) {
            // **HABILITA** antes de patchar
            this.formEstrutura.get('distritoId')?.enable();
            this.formEstrutura.patchValue({
              distritoId: distritoIdParam
            });
            // Só depois de patchar, desabilita
            this.formEstrutura.get('distritoId')?.disable();
            // Teste: veja se o valor foi setado
            console.log('Após patch e disable:', this.formEstrutura.value.distritoId, this.formEstrutura.getRawValue().distritoId);
          }
        });
      }
      console.log('EnderecoLoteDTO:', this.formEstrutura.value);
      const enderecoLoteDTO: EnderecoLoteDTO = this.formEnderecoLote.value;
      this.formEnderecoLote.patchValue(enderecoLoteDTO);
    });

    // Desabilite se for readonly
    this.formEstrutura.get('municipioId')?.disable();
    this.formEstrutura.get('numero')?.disable();
    this.formEstrutura.get('distritoId')?.disable();
    this.formEstrutura.get('denominacaoImovel')?.disable();
  }

  atualizarEstrutura(): void {
    if (this.formEstrutura.valid) {
      const dto = this.mapFormToDto(this.formEstrutura);
      console.log('Enviando para atualização:', this.formEstrutura.value);

      this.formEnderecoLote.patchValue(enderecoLoteDTOToFormValue(dto));
      this.estruturaService.atualizar(dto.id, dto).subscribe({
        next: () => {
          this.snackBar.open('Estrutura atualizada com sucesso!', 'Fechar', { duration: 3000 });
        },
        error: (err) => {
          console.error('❌ Erro ao atualizar estrutura:', err);
          this.snackBar.open('Erro ao atualizar estrutura.', 'Fechar', { duration: 3000 });
        }
      });
    } else {
      this.snackBar.open('Formulário inválido.', 'Fechar', { duration: 3000 });
    }


  }

  private mapFormToDto(form: FormGroup): any {
    const raw = form.getRawValue();

    const formatDate = (d: any) => {
      if (!d || d === 'null') return null;
      const date = new Date(d);
      return isNaN(date.getTime()) ? null : date.toISOString().split('T')[0];
    };

    const safeString = (value: any) => value === 'null' ? null : value;
    const safeNumber = (value: any) => value === 'null' || value === null || value === '' ? 0 : value;

    return {
      id: raw.id,
      loteId: raw.loteId,
      numero: safeString(raw.numero),
      municipioId: raw.municipioId,
      distritoId: raw.distritoId,
      situacaoJuridicaId: typeof raw.situacaoSelecionada === 'object' ? raw.situacaoSelecionada?.id : raw.situacaoSelecionada,
      situacaoJuridicaNome: raw.situacaoJuridicaNome,
      denominacaoImovel: safeString(raw.denominacaoImovel),
      situacaoSelecionada: raw.situacaoSelecionada,
      formaObtencaoSelecionada: raw.formaObtencaoSelecionada,
      dataPosse: formatDate(raw.dataPosse),
      areaPosse: safeNumber(raw.areaPosse),
      livro: safeString(raw.livro),
      areaRegistrada: safeString(raw.areaRegistrada),
      nomeCartorio: safeString(raw.nomeCartorio),
      municipioCartorio: safeString(raw.municipioCartorio),
      dataRegistro: formatDate(raw.dataRegistro),
      oficio: safeString(raw.oficio),
      matricula: safeString(raw.matricula),
      numeroRegistro: safeString(raw.numeroRegistro),
      codImoReceita: safeString(raw.codImoReceita),
      comunidade: safeString(raw.comunidade),
      localidade: safeString(raw.localidade),
      area: safeNumber(raw.area),
      sncr: safeString(raw.sncr),
      pontoReferencia: safeString(raw.pontoReferencia),
      familiasResidentes: safeNumber(raw.familiasResidentes),
      pessoasResidentes: safeNumber(raw.pessoasResidentes),
      trabalhadoresComCarteira: safeNumber(raw.trabalhadoresComCarteira),
      trabalhadoresSemCarteira: safeNumber(raw.trabalhadoresSemCarteira),
      valorTotal: safeNumber(raw.valorTotal),
      valorDasBenfeitorias: safeNumber(raw.valorDasBenfeitorias),
      valorOutrasAtividades: safeNumber(raw.valorOutrasAtividades),
      valorTerraNua: safeNumber(raw.valorTerraNua),
      destinacaoDoImovel: safeString(raw.destinacaoDoImovel),
      litigio: safeString(raw.litigio),
      entregouMemorialPlanilha: raw.entregouMemorialPlanilha ?? false,
      isIrrigacao: raw.isIrrigacao ?? false,
      isFonteAguaExterna: raw.isFonteAguaExterna ?? false,
      isRedeDeAbastecimento: raw.isRedeDeAbastecimento ?? false,
      isAcude: raw.isAcude ?? false,
      isAcudePerene: raw.isAcudePerene ?? false,
      usoDaguaAcude: safeString(raw.usoDaguaAcude),
      isLagoa: raw.isLagoa ?? false,
      isLagoaPerene: raw.isLagoaPerene ?? false,
      usoDaguaLagoa: safeString(raw.usoDaguaLagoa),
      isPoco: raw.isPoco ?? false,
      isPocoPerene: raw.isPocoPerene ?? false,
      usoDaguaPoco: safeString(raw.usoDaguaPoco),
      isRioOuRiacho: raw.isRioOuRiacho ?? false,
      isRioOuRiachoPerene: raw.isRioOuRiachoPerene ?? false,
      usoDaguaRioOuRiacho: safeString(raw.usoDaguaRioOuRiacho),
      isOlhoDagua: raw.isOlhoDagua ?? false,
      isOlhoDaguaPerene: raw.isOlhoDaguaPerene ?? false,
      usoDaguaOlhoDagua: safeString(raw.usoDaguaOlhoDagua),
      isPossuiEnergiaAlternativa: raw.isPossuiEnergiaAlternativa ?? false,
      tipoEnergiaEletrica: safeString(raw.tipoEnergiaEletrica),
    };
  }

  private formatarData(data: Date | string): string {
    if (!data) return '';
    const d = new Date(data);
    return d.toISOString().split('T')[0]; // yyyy-MM-dd
  }


  carregarEstruturaPorLoteId(loteId: number) {
    this.estruturaService.buscarPorLoteId(loteId).subscribe({
      next: (estruturaDTO) => {
        if (estruturaDTO) {
          console.log('DTO recebido:', estruturaDTO);
          // ⚠️ Carregar distritos antes de patchar (para evitar select vazio)
          this.loadDistritosByMunicipio(estruturaDTO.municipioId).then(() => {
            // Habilita os campos necessários ANTES do patchValue
            this.formEstrutura.get('municipioId')?.enable();
            this.formEstrutura.get('distritoId')?.enable();
            this.formEstrutura.get('numero')?.enable();
            this.formEstrutura.get('denominacaoImovel')?.enable();

            this.formEstrutura.patchValue({
              ...estruturaDTO,
              situacaoSelecionada: estruturaDTO.situacaoJuridicaId
            });

            // Desabilita depois do patchValue (se necessário)
            this.formEstrutura.get('municipioId')?.disable();
            this.formEstrutura.get('distritoId')?.disable();
            this.formEstrutura.get('numero')?.disable();
            this.formEstrutura.get('denominacaoImovel')?.disable();
            this.cd.markForCheck(); // força detecção se necessário

            console.log('📦 EstruturaDTO patchado:', estruturaDTO);
          });
        }
      },
      error: (err) => {
        console.error('❌ Erro ao carregar estrutura:', err);
      }

    });
  }

  private paramCache: any = null;

  carregarMunicipios(): void {
    this.municipioService.getMunicipiosCe().subscribe({
      next: (res) => {
        this.municipios = res;
        // Reaplica patchValue do municipioId quando os municípios chegam
        if (this.paramCache && this.paramCache['municipioId']) {
          this.formEstrutura.patchValue({
            municipioId: +this.paramCache['municipioId']
          });
        }
      },
      error: (err) => console.error('Erro ao carregar municípios:', err)
    });
  }

  loadDistritosByMunicipio(municipioId: number): Promise<void> {
    this.isLoadingDistrito = true;
    return new Promise((resolve, reject) => {
      this.distritoService.getDistritosByMunicipio(municipioId).subscribe({
        next: distritos => {
          this.filteredDistritos = distritos;
          this.isLoadingDistrito = false;
          resolve();
        },
        error: err => {
          console.error('Erro ao carregar distritos:', err);
          this.filteredDistritos = [];
          this.isLoadingDistrito = false;
          reject();
        }
      });
    });
  }


  // Métodos de utilidade para exibir os nomes
  getNomeMunicipio(): string {
    const id = this.formEstrutura.get('municipioId')?.value;
    const mun = this.municipios.find(m => m.id === id);
    return mun ? mun.nome : '';
  }

  getNomeDistrito(): string {
    const id = this.formEstrutura.get('distritoId')?.value;
    return this.filteredDistritos.find(d => d.id === id)?.nomeDistrito ?? '';
  }

  logForm() {
    console.log('Form Value:', this.formEstrutura.value);
    console.log('Form Raw Value:', this.formEstrutura.getRawValue());
    console.log('Status:', this.formEstrutura.status);
  }

  filtrarLotesPorMunicipio(municipioId: number): void {
    console.log('🔍 Tentando filtrar lotes pelo município ID:', municipioId);
    debugger; // <- Coloque esse ponto de parada no navegador para inspecionar
    this.lotesFiltrados = this.lotes.filter(lote => {
      console.log(`➡️ Lote ${lote.numero} com municípioId:`, lote.municipioId);
      return lote.municipioId === municipioId;
    });
    console.log('✅ Lotes filtrados:', this.lotesFiltrados);
  }

  preencherCamposLote(lote: LoteDTO): void {
    console.log('Valor vindo do backend:', lote.situacaoJuridicaId, typeof lote.situacaoJuridicaId);
    console.log('Opções:', this.situacoes);
    this.formEstrutura.patchValue({
      loteId: lote.id,
      numero: lote.numero,
      sncr: lote.sncr,
      area: lote.area,
      denominacaoImovel: lote.denominacaoImovel,
      municipioId: lote.municipioId,
      distritoId: lote.distritoId,
      situacaoSelecionada: lote.situacaoJuridicaId,
      cpf: lote.cpf,
      perimetro: lote.perimetro
    });

    if (lote.municipioId) {
      this.loadDistritosByMunicipio(lote.municipioId);
    }
  }

  get loteIdSelecionado(): number | null {
    return this.formEstrutura.get('loteId')?.value ?? null;
  }

  carregarLoteParaEstrutura(loteId: number) {
    this.loteService.obterPorId(loteId).subscribe(lote => {
      this.formEstrutura.patchValue({
        loteId: lote.id,
        numero: lote.numero,
        sncr: lote.sncr,
        area: lote.area,
        denominacaoImovel: lote.denominacaoImovel,
        municipioId: lote.municipioId,
        distritoId: lote.distritoId,
        pontoReferencia: lote.denominacaoImovel, // ou outro valor
        situacaoJuridicaId: lote.situacaoJuridicaId
      });

      // Opcional: carregar distritos com base no município
      if (lote.municipioId) {
        this.loadDistritosByMunicipio(lote.municipioId);
      }
    });
  }

  loadMunicipiosCe(): void {
    this.isLoadingMunicipio = true;
    this.municipioService.getMunicipiosCe().subscribe({
      next: (data) => {
        this.municipios = data;
        this.isLoadingMunicipio = false;
      },
      error: (error) => {
        console.error('Erro ao carregar municípios:', error);
        this.isLoadingMunicipio = false;
      }
    });
  }

  compareMunicipios(m1: Municipio, m2: Municipio): boolean {
    return m1 && m2 ? m1.id === m2.id : m1 === m2;
  }

  compareDistritos(d1: Distrito, d2: Distrito): boolean {
    return d1 && d2 ? d1.id === d2.id : d1 === d2;
  }

  salvarEstrutura(): void {
    if (!this.formEstrutura.valid || !this.formEnderecoLote.valid) {
      this.formEstrutura.markAllAsTouched();
      this.formEnderecoLote.markAllAsTouched();
      this.snackBar.open('Preencha todos os campos obrigatórios.', 'Fechar', { duration: 4000 });
      return;
    }
    const raw = this.formEstrutura.getRawValue();

    // Verifica campo obrigatório
    if (!raw.situacaoSelecionada) {
      console.warn('⚠️ Campo situacaoSelecionada está faltando!');
      this.snackBar.open('Situação Jurídica é obrigatória.', 'Fechar', { duration: 4000 });
      return;
    }

    // Mapeamento separado
    const estruturaDTO = mapFormToEstruturaDTO(this.formEstrutura);

    console.log('✅ EstruturaDTO para envio:', estruturaDTO);
    console.log('🧪 Payload enviado ao backend:', estruturaDTO);

    this.estruturaService.salvar(estruturaDTO).subscribe({
      next: (res) => {
        console.log('✅ Estrutura salva com sucesso!', res);
        this.snackBar.open('Estrutura salva com sucesso!', 'Fechar', { duration: 3000 });
        const enderecoLoteDTO: EnderecoLoteDTO = mapFormToEnderecoLoteDTO(this.formEnderecoLote);

        // Depois de salvar Estrutura, salva Endereço do Lote
        enderecoLoteDTO.loteId = res.loteId || res.id;
        this.enderecoLoteService.salvar(enderecoLoteDTO).subscribe({
        next: (res) => {
          this.snackBar.open('Endereço do lote salvo!', 'Fechar', { duration: 3000 });
          // Redirecione, atualize ou o que preferir...
          this.formEnderecoLote.patchValue(enderecoLoteDTOToFormValue(enderecoLoteDTO));
        },
        error: (err) => {
          this.snackBar.open('Erro ao salvar endereço do lote.', 'Fechar', { duration: 3000 });
        }
      });

        const loteId = this.formEstrutura.get('loteId')?.value;
        if (loteId) {
          this.router.navigate(['/cadastro-pessoas'], { queryParams: { loteId } });
        }
      },
      error: (err) => {
        console.error('❌ Erro ao salvar estrutura:', err);
        this.snackBar.open('Erro ao salvar estrutura', 'Fechar', { duration: 4000 });
      }
    });
  }

  private formatToISO(date: Date | string | null): string | null {
    if (!date) return null;
    const d = new Date(date);
    // Corrige para fuso do Brasil 
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0];// yyyy-MM-dd
  }


  carregarEstruturas(): void {
    this.estruturaService.obterTodas().subscribe({
      next: (estruturas) => {
        console.log('Estruturas carregadas:', estruturas);
      },
      error: (erro) => {
        console.error('Erro ao carregar estruturas:', erro);
      }
    });
  }

  carregarLotes(): void {
    this.loteService.obterTodos().subscribe({
      next: (res) => {
        this.lotes = res;
        console.log('📦 Todos os lotes carregados:', this.lotes);
      },
      error: (err) => console.error('Erro ao carregar lotes:', err)
    });
  }

  preencherEstruturaComLote(lote: LoteDTO) {
    this.formEstrutura.patchValue({
      loteId: lote.id,
      numero: lote.numero,
      sncr: lote.sncr,
      area: lote.area,
      denominacaoImovel: lote.denominacaoImovel,
      municipioId: lote.municipioId,
      distritoId: lote.distritoId,
      situacaoJuridicaId: lote.situacaoJuridicaId
    });
  }

  onSubmit(): void {
    if (!this.formEstrutura.valid || !this.formEnderecoLote.valid) {
      this.formEstrutura.markAllAsTouched();
      this.formEnderecoLote.markAllAsTouched();
      this.snackBar.open('Preencha todos os campos obrigatórios.', 'Fechar', { duration: 4000 });
      return;
    }
  
    
    if (this.formEstrutura.valid) {
      this.salvarEstrutura();
    } else {
      this.formEstrutura.markAllAsTouched();
      console.warn('⚠️ Formulário inválido. Corrija os campos.');
    }
  }

  energias: energia[] = [
    { value: 'solar', viewValue: 'SOLAR' },
    { value: 'eolica', viewValue: 'EÓLICA' },
  ];

  destinacoes: destinacaoDoImovel[] = [
    { value: 'hortigranjeiro', viewValue: '01 - Hortigranjeiro' },
    { value: 'producaoGraos', viewValue: '02 - Produção Grãos (Temporários)' },
    { value: 'agriculturaPermanente', viewValue: '03 - Agricultura (Permanente)' },
    { value: 'reflorestamento', viewValue: '04 - Reflorestamento' },
    { value: 'extrativismo', viewValue: '05 - Extrativismo' },
    { value: 'pecuaria', viewValue: '06 - Pecuária' },
    { value: 'industrial', viewValue: '07 - Industrial' },
    { value: 'comercial', viewValue: '08 - Comercial' },
    { value: 'pesquisa', viewValue: '09 - Pesquisa' },
    { value: 'educacaoCentroDeTreinamento', viewValue: '10 - Educação Centro de Treinamento' },
    { value: 'colonizacaoAssentamento', viewValue: '11 - Colonização/Assentamento' },
    { value: 'readaptacao', viewValue: '12 - Readaptação' },
    { value: 'mineracao', viewValue: '13 - Mineração' },
    { value: 'areaIndigena', viewValue: '14 - Área Indígena' },
    { value: 'unidadeConservacaoAmbiental', viewValue: '15 - Unidade de Conservação Ambiental' },
    { value: 'armazenamento', viewValue: '16 - Armazenamento' },
    { value: 'oleodutoGasoduto', viewValue: '17 - Oleoduto/Gasoduto' },
    { value: 'ferroviaRodovia', viewValue: '18 - Ferrovia/Rodovia' },
    { value: 'linhaTransmissaoRepetidora', viewValue: '19 - Linha de Transmissão/Estação Repetidora' },
    { value: 'tratamentoAguaEsgoto', viewValue: '20 - Tratamento Água/Esgoto/Resíduo' },
    { value: 'barragemRepresaAcude', viewValue: '21 - Barragem/Represa/Açude' },
    { value: 'exploracaoPetrolifera', viewValue: '22 - Exploração Petrolífera' },
    { value: 'infraestruturaAeroportuaria', viewValue: '23 - Infra-Estrutura Aeroportuárea' },
    { value: 'entidadeBancaria', viewValue: '24 - Entidade Bancária' },
    { value: 'areaUsoMilitar', viewValue: '25 - Área de Uso Militar' },
    { value: 'recreacao', viewValue: '26 - Recreação' },
    { value: 'assistencialHospitalar', viewValue: '27 - Assistencial ou Hospitalar' },
    { value: 'olaria', viewValue: '28 - Olaria' },
    { value: 'outraAtividade', viewValue: '29 - Outra Atividade' },
    { value: 'fomento', viewValue: '30 - Fomento' },
    { value: 'semDestinacao', viewValue: '31 - Sem Destinação' }
  ];

  litigios: litigio[] = [
    { value: 'areaComPosseiros', viewValue: '09 - Área com Posseiros' },
    { value: 'limite', viewValue: '17 - Questão de Limite' },
    { value: 'titulacao', viewValue: '25 - Questão de Titulação' },
    { value: 'posse', viewValue: '25 - Questão quanto à Posse' },
    { value: 'posseDominio', viewValue: '41 - Questão quanto à Posse a ao Domínio' },
    { value: 'dominio', viewValue: '50 - Questão quanto ao Domínio' },
    { value: 'restricaoAoUsoDaTerra', viewValue: '68 - Questão de Restrição ao Uso da Terra' },
    { value: 'servidao', viewValue: '76 - Servidão do Acesso' },
    { value: 'servidaoUsoAgua', viewValue: '84 - Servidão do Uso da Água' },
    { value: 'outras', viewValue: '92 - Outras' },
    { value: 'inexistente', viewValue: '99 - Inexistente' },
  ];

  aguas: usoDaAgua[] = [
    { value: 'usoHumano', viewValue: 'Uso Humano' },
    { value: 'aplicacaoAgricola', viewValue: 'Aplicação Agrícola' },
    { value: 'usoHumanoAgricola', viewValue: 'Uso Humano e Agrícola' },
    { value: 'usoAnimal', viewValue: 'Uso Animal' },
    { value: 'usoHumanoAnimalAgricola', viewValue: 'Uso Humano/Animal e Agrícola' },
    { value: 'usoHumanoEAnimal', viewValue: 'Uso Humano e Animal' },
    { value: 'usoAnimalAgricola', viewValue: 'Uso Animal e Agrícola' },
    { value: 'semUso', viewValue: 'Sem Uso' },
  ];

  situacoes = [
    { value: 1, viewValue: 'Posse por Simples Ocupação' },
    { value: 2, viewValue: 'Posse aJusto Título' },
    { value: 3, viewValue: 'Área Registrada (Domínio)' },
    { value: 99, viewValue: 'Indefinido' }
  ];

  obtencoes = [
    { value: 'aquisicaoGovEstadual', viewValue: '01 - Aquisição do Governo Estadual' },
    { value: 'adjudicacao', viewValue: '02 - Adjudicação' },
    { value: 'aquisicaoGovFederal', viewValue: '03 - Aquisição do Governo Federal' },
    { value: 'aquisicaoIncra', viewValue: '04 - Aquisição INCRA' },
    { value: 'aquisicaoGovMunicipal', viewValue: '05 - Aquisição do Governo Municipal' },
    { value: 'cartaArrecadacao', viewValue: '06 - Carta de Arrecadação' },
    { value: 'compraVendaParticular', viewValue: '07 - Compra e Venda de Particular' },
    { value: 'cartaArrecadacao', viewValue: '08 - Carta de Arrecadação' },
    { value: 'concessaoUsoGovFederal', viewValue: '09 - Concessão de Uso/Governo Federal' },
    { value: 'concessaoUsoIncra', viewValue: '10 - Concessão de Uso/INCRA' },
    { value: 'concessaoUsoMunicipal', viewValue: '11 - Concessão de Uso/Municipal' },
    { value: 'doacao', viewValue: '12 - Doação' },
    { value: 'foroOuEnfiteuse', viewValue: '13 - Foro ou Enfiteuse' },
    { value: 'incorporacao', viewValue: '14 - Incorporação' },
    { value: 'recebimentoHeranca', viewValue: '15 - Recebimento de Herança' },
    { value: 'usucapiao', viewValue: '16 - Usucapião' },
    { value: 'usufruto', viewValue: '17 - Usufruto' },
    { value: 'doacaoEmPagamento', viewValue: '18 - Doação em Pagamento' },
    { value: 'desapropriacao', viewValue: '19 - Desapropriação' },
    { value: 'outras', viewValue: '20 - Outros' }
  ];

}
