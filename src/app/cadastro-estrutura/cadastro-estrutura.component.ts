import { ChangeDetectionStrategy, Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Municipio } from '../models/municipio';
import { Distrito } from '../models/distrito';
import { LoteDTO } from '../models/lote-dto';
import { MunicipioService } from '../services/municipio.service';
import { DistritoService } from '../services/distrito.service';
import { LoteService } from '../services/lote.service';
import { EstruturaService } from '../services/estrutura.service';
import { CadastroSituacaoJuridicaComponent } from '../cadastro-situacao-juridica/cadastro-situacao-juridica.component';
import { estruturaDTOToFormValue, mapFormToEstruturaDTO } from '../helpers/estrutura-mapper';
import { MatButtonToggleModule } from "@angular/material/button-toggle";

import { Location } from '@angular/common';
import { BackButtonComponent } from '../shared/components/back-button/back-button.component';


type SelectOption<T = any> = { value: T; viewValue: string };

@Component({
  selector: 'app-cadastro-estrutura',
  standalone: true,
  imports: [
    // Angular
    CommonModule,
    ReactiveFormsModule,
    // Material / layout
    FlexLayoutModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatProgressSpinnerModule,
    // Seu componente filho
    CadastroSituacaoJuridicaComponent,
    MatButtonToggleModule,
    BackButtonComponent
  ],
  templateUrl: './cadastro-estrutura.component.html',
  styleUrl: './cadastro-estrutura.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CadastroEstruturaComponent implements OnInit {
  formEstrutura!: FormGroup;

  municipios: Municipio[] = [];
  filteredDistritos: Distrito[] = [];
  lotes: LoteDTO[] = [];
  lotesFiltrados: LoteDTO[] = [];

  isLoadingDistrito = false;

  // listas usadas no template
  energias: SelectOption[] = [
    { value: 'solar', viewValue: 'SOLAR' },
    { value: 'eolica', viewValue: 'EÓLICA' },
  ];

  destinacoes: SelectOption[] = [
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
    { value: 'semDestinacao', viewValue: '31 - Sem Destinação' },
  ];

  litigios: SelectOption[] = [
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

  aguas: SelectOption[] = [
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
    { value: 1, viewValue: 'Posse Por Simples Ocupação' },
    { value: 2, viewValue: 'Posse a Justo Título' },
    { value: 3, viewValue: 'Área Registrada (Domínio)' },
    { value: 99, viewValue: 'Indefinido' },
  ];

  obtencoes = [
    { value: 1, viewValue: '01 - Aquisição do Governo Estadual' },
    { value: 2, viewValue: '02 - Adjudicação' },
    { value: 3, viewValue: '03 - Aquisição do Governo Federal' },
    { value: 4, viewValue: '04 - Aquisição INCRA' },
    { value: 5, viewValue: '05 - Aquisição do Governo Municipal' },
    { value: 6, viewValue: '06 - Carta de Arrematação' },
    { value: 7, viewValue: '07 - Compra e Venda de Particular' },
    { value: 8, viewValue: '08 - Concessão de Uso/Governo Estadual' },
    { value: 9, viewValue: '09 - Concessão de Uso/Governo Federal' },
    { value: 10, viewValue: '10 - Concessão de Uso/INCRA' },
    { value: 11, viewValue: '11 - Concessão de Uso/Municipal' },
    { value: 12, viewValue: '12 - Doação' },
    { value: 13, viewValue: '13 - Foro ou Enfiteuse' },
    { value: 14, viewValue: '14 - Incorporação' },
    { value: 15, viewValue: '15 - Recebimento de Herança' },
    { value: 16, viewValue: '16 - Usucapião' },
    { value: 17, viewValue: '17 - Usufruto' },
    { value: 18, viewValue: '18 - Doação em Pagamento' },
    { value: 19, viewValue: '19 - Desapropriação' },
    { value: 20, viewValue: '20 - Outras' },
  ];

  private paramCache: any = null;

  constructor(
    private fb: FormBuilder,
    private loteService: LoteService,
    private municipioService: MunicipioService,
    private distritoService: DistritoService,
    private estruturaService: EstruturaService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private router: Router,
    private location: Location
  ) { }

  /** Modo edição é derivado do form (se tem id, atualiza) */
  get isAtualizando(): boolean {
    return !!this.formEstrutura?.get('id')?.value;
  }

  ngOnInit(): void {
    // form base
    this.formEstrutura = this.fb.group({
      id: [null],
      loteId: [null, Validators.required],
      municipioId: [null, Validators.required],
      distritoId: [null, Validators.required],
      numero: [''],
      denominacaoImovel: [''],
      area: [null, Validators.required],
      sncr: [''],
      situacaoJuridicaId: [null, Validators.required],

      formaObtencaoId: [null],
      descricaoFormaDeObtencao: [''],
      livro: [''],
      matricula: [''],
      municipioCartorio: [''],
      nomeCartorio: [''],
      dataRegistro: [''],
      numeroRegistro: [''],
      areaRegistrada: [''],
      areaMedida: [''],
      dataPosse: [''],
      areaPosse: [''],
      numeroHerdeiros: [null],
      numeroHerdeirosForma: [null],
      oficio: [''],

      familiasResidentes: [0],
      pessoasResidentes: [0],
      trabalhadoresComCarteira: [0],
      trabalhadoresSemCarteira: [0],
      maoDeObraFamiliar: [0],

      valorTotal: [0],
      valorDasBenfeitorias: [0],
      valorOutrasAtividades: [0],
      valorTerraNua: [0],
      areaIrrigada: [0],

      litigio: [null],
      entregouMemorialPlanilha: [false],
      destinacaoDoImovel: [null],
      porcentagemDetencao: [null],
      obsLitigio: [null],

      isFonteAguaExterna: [false],
      isPossuiElergiaEletrica: [false],
      isPossuiEnergiaAlternativa: [false],
      tipoEnergiaEletrica: [null],

      isIrrigacao: [false],
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
      isRedeDeAbastecimento: [false],

      ativo: [null],
      dhc: [null],
      dhm: [null],
    });

    // bloqueios somente leitura
    //this.formEstrutura.get('municipioId')?.disable();
    //this.formEstrutura.get('numero')?.disable();
    //this.formEstrutura.get('distritoId')?.disable();
    //this.formEstrutura.get('denominacaoImovel')?.disable();

    // carregar dados base
    this.carregarMunicipios();
    this.carregarLotes();

    // query params
    this.route.queryParams.subscribe(params => {
      const fromQP = params['loteId'] ?? params['id'];
      const fromSnap = this.route.snapshot.queryParamMap.get('loteId')
        ?? this.route.snapshot.queryParamMap.get('id');
      const fromNav = (this.router.getCurrentNavigation()?.extras.state as any)?.loteId;

      const loteId = Number(fromQP ?? fromSnap ?? fromNav ?? this.formEstrutura.get('loteId')?.value)
      console.log('[Estrutura] loteId resolvido:', loteId, { fromQP, fromSnap, fromNav })

      if (Number.isFinite(loteId) && loteId > 0) {
        // mantém sincronizado no form (útil em navegações em cadeia)
        this.formEstrutura.patchValue({ loteId });
        this.carregarEstruturaPorLoteId(loteId);
      } else {
        console.warn('[Estrutura] loteId não encontrado na URL/estado de navegação.');
      }

      const formaId = this.formEstrutura.get('formaObtencaoId')?.value;
      const descricao = this.obtencoes.find(o => o.value === formaId)?.viewValue || '';

      this.paramCache = params;

      this.formEstrutura.patchValue({
        id: params['id'] ? +params['id'] : null,
        municipioId: params['municipioId'] ? +params['municipioId'] : null,
        loteId: params['loteId'] ? +params['loteId'] : null,
        numero: params['numero'] ?? '',
        area: params['area'] ? +params['area'] : null,
        denominacaoImovel: params['denominacaoImovel'] || '',
        sncr: params['sncr'] ?? '',
        situacaoJuridicaId: params['situacaoJuridicaId'] ?? null,
        descricaoFormaDeObtencao: descricao,
      });

      if (params['municipioId']) {
        this.distritoService.getDistritosByMunicipio(+params['municipioId']).subscribe(distritos => {
          this.filteredDistritos = distritos;
          const distritoIdParam = params['distritoId'] ? Number(params['distritoId']) : null;
          if (distritoIdParam) {
            this.formEstrutura.get('distritoId')?.enable();
            this.formEstrutura.patchValue({ distritoId: distritoIdParam });
            this.formEstrutura.get('distritoId')?.disable();
          }
        });
      }
    });
  }

  /** Nome a partir do id — útil em campos readonly */
  getNomeMunicipio(): string {
    const id = this.formEstrutura.get('municipioId')?.value;
    const mun = this.municipios.find(m => m.id === id);
    return mun ? mun.nome : '';
  }

  getNomeDistrito(): string {
    const id = this.formEstrutura.get('distritoId')?.value;
    return this.filteredDistritos.find(d => d.id === id)?.nomeDistrito ?? '';
  }

  onMunicipioChange(municipioId: number): void {
    this.loadDistritosByMunicipio(municipioId);
    this.lotesFiltrados = this.lotes.filter(l => l.municipioId === municipioId);
  }

  carregarMunicipios(): void {
    this.municipioService.getMunicipiosCe().subscribe({
      next: (res) => {
        this.municipios = res;
        if (this.paramCache?.['municipioId']) {
          this.formEstrutura.patchValue({ municipioId: +this.paramCache['municipioId'] });
        }
      },
      error: (err) => console.error('Erro ao carregar municípios:', err),
    });
  }

  carregarLotes(): void {
    this.loteService.obterTodos().subscribe({
      next: (res) => (this.lotes = res),
      error: (err) => console.error('Erro ao carregar lotes:', err),
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
        error: (err) => {
          console.error('Erro ao carregar distritos:', err);
          this.filteredDistritos = [];
          this.isLoadingDistrito = false;
          reject();
        },
      });
    });
  }

  carregarEstruturaPorLoteId(loteId: number) {
    console.log('[Estrutura] carregando por loteId:', loteId);
    this.estruturaService.buscarPorLoteId(loteId).subscribe({
      next: (estruturaDTO) => {
        if (!estruturaDTO) {
          console.warn('[Estrutura] Nenhuma estrutura retornada para loteId', loteId);
          return;
        }

        this.loadDistritosByMunicipio(estruturaDTO.municipioId).then(() => {
          // habilita p/ patch integral e volta a desabilitar
          this.formEstrutura.get('municipioId')?.enable();
          this.formEstrutura.get('distritoId')?.enable();
          this.formEstrutura.get('numero')?.enable();
          this.formEstrutura.get('denominacaoImovel')?.enable();

          this.formEstrutura.patchValue(estruturaDTOToFormValue(estruturaDTO));

          this.formEstrutura.get('municipioId')?.disable();
          this.formEstrutura.get('distritoId')?.disable();
          this.formEstrutura.get('numero')?.disable();
          this.formEstrutura.get('denominacaoImovel')?.disable();

          console.log('[Estrutura] DTO aplicado no form:', this.formEstrutura.getRawValue());
          this.cd.markForCheck();
        });
      },
      error: (err) => {
        if (err?.status === 404) {
          console.warn('[Estrutura] 404: ainda não existe estrutura para este lote. Modo SALVAR.');
        } else {
          console.error('❌ Erro ao carregar estrutura:', err);
        }
      }
    });
  }

  onSubmit(): void {
    if (this.formEstrutura.valid) {
      this.isAtualizando ? this.onAtualizar() : this.onSalvar();
    } else {
      this.formEstrutura.markAllAsTouched();
      this.snackBar.open('Formulário inválido.', 'Fechar', { duration: 3000 });
    }
  }

  onAtualizar(): void {
    if (!this.formEstrutura.valid) {
      this.snackBar.open('Formulário inválido.', 'Fechar', { duration: 3000 });
      return;
    }

    const formaId = this.formEstrutura.get('formaObtencaoId')?.value;
    const descricao = this.obtencoes.find(o => o.value === formaId)?.viewValue || '';
    this.formEstrutura.patchValue({ descricaoFormaDeObtencao: descricao });

    const dto = mapFormToEstruturaDTO(this.formEstrutura);

    this.estruturaService.atualizar(dto.id, dto).subscribe({
      next: () => {
        this.snackBar.open('Estrutura atualizada com sucesso!', 'Fechar', { duration: 3000 });
        this.router.navigate(['/cadastro-pessoas'], { queryParams: { loteId: dto.loteId } });
      },
      error: (err) => {
        console.error('❌ Erro ao atualizar estrutura:', err);
        this.snackBar.open('Erro ao atualizar estrutura.', 'Fechar', { duration: 3000 });
      },
    });
  }

  onSalvar(): void {
    if (!this.formEstrutura.valid) {
      this.formEstrutura.markAllAsTouched();
      this.snackBar.open('Preencha todos os campos obrigatórios.', 'Fechar', { duration: 4000 });
      return;
    }

    const formaId = this.formEstrutura.get('formaObtencaoId')?.value;
    const descricao = this.obtencoes.find(o => o.value === formaId)?.viewValue || '';
    this.formEstrutura.patchValue({ descricaoFormaDeObtencao: descricao, formaId });

    const dto = mapFormToEstruturaDTO(this.formEstrutura);

    this.estruturaService.salvar(dto).subscribe({
      next: () => {
        this.snackBar.open('Estrutura salva com sucesso!', 'Fechar', { duration: 3000 });
        const loteId = this.formEstrutura.get('loteId')?.value;
        if (loteId) {
          this.router.navigate(['/cadastro-pessoas'], { queryParams: { loteId: dto.loteId } });
        }
      },
      error: (err) => {
        console.error('❌ Erro ao salvar estrutura:', err);
        this.snackBar.open('Erro ao salvar estrutura.', 'Fechar', { duration: 4000 });
      },
    });
  }

  onDelete(): void {
    const id = this.formEstrutura.get('id')?.value as number | null;
    if (!id) return;
    if (!confirm('Remover este endereço do lote?')) return;

    this.estruturaService.delete(id).subscribe({
      next: () => {
        this.snackBar.open('Estrutura removida.', 'Fechar', { duration: 3000 });
        this.formEstrutura.reset({ loteId: this.formEstrutura.get('loteId')?.value });
      },
      error: () => this.snackBar.open('Erro ao remover.', 'Fechar', { duration: 4000 }),
    });
  }

  limparFormulario(): void {
    this.formEstrutura.reset({ loteId: this.formEstrutura.get('loteId')?.value });
  }

  /** Utils de comparação (caso use compareWith no template) */
  compareMunicipios(m1: Municipio, m2: Municipio): boolean {
    return m1 && m2 ? m1.id === m2.id : m1 === m2;
  }
  compareDistritos(d1: Distrito, d2: Distrito): boolean {
    return d1 && d2 ? d1.id === d2.id : d1 === d2;
  }

  onVoltarClick(): void {
    // Lógica customizada antes de voltar
    const loteId = this.formEstrutura.get('loteId')?.value;
    
    if (loteId) {
      // Navega para a página de cadastro de lotes (anterior na sequência)
      this.router.navigate(['/cadastro-lotes'], { 
        queryParams: { id: loteId } 
      });
    } else {
      // Volta para a página anterior
      this.location.back();
    }
  }
}
