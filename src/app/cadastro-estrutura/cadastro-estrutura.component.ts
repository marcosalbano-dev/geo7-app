import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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
import { EnderecoLoteService } from '../services/endereco-lote.service';
import { FormaObtencaoService } from '../services/forma-obtencao.service';
import { SituacaoJuridicaService } from '../services/situacao-juridica.service';
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
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CadastroEstruturaComponent implements OnInit {
  formEstrutura!: FormGroup;

  municipios: Municipio[] = [];
  filteredDistritos: Distrito[] = [];
  lotes: LoteDTO[] = [];
  lotesFiltrados: LoteDTO[] = [];
  situacoes: SelectOption[] = [];

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
    private enderecoLoteService: EnderecoLoteService,
    private formaObtencaoService: FormaObtencaoService,
    private situacaoJuridicaService: SituacaoJuridicaService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) { }

  /** Modo edição é derivado do form (se tem id ou loteId, atualiza) */
  get isAtualizando(): boolean {
    const hasId = !!this.formEstrutura?.get('id')?.value;
    const hasLoteId = !!this.formEstrutura?.get('loteId')?.value;
    return hasId || hasLoteId;
  }

  /** Número do lote para exibição */
  numeroLote: string = '';

  /** Carrega o número do lote para exibição */
  private carregarNumeroLote(loteId: number): void {
    this.loteService.obterPorId(loteId).subscribe({
      next: (lote) => {
        this.numeroLote = lote.numero || `Lote ${loteId}`;
      },
      error: (err) => {
        console.warn('[Estrutura] Erro ao carregar número do lote:', err);
        this.numeroLote = `Lote ${loteId}`;
      }
    });
  }

  ngOnInit(): void {
    // form base - todos os campos são opcionais
    this.formEstrutura = this.fb.group({
      id: [null],
      loteId: [null], // Opcional
      municipioId: [null], // Opcional
      distritoId: [null], // Opcional
      numero: [''],
      denominacaoImovel: [''],
      area: [null], // Opcional
      sncr: [''],
      situacaoJuridicaId: [null], // Opcional
      
      // Campos de localização
      localidade: [''],
      comunidade: [''],
      indicacaoLocalizacao: [''],
      pontoDeReferencia: [''],
      codImoReceita: [''],

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
        this.carregarNumeroLote(loteId);
        this.carregarEstruturaPorLoteId(loteId);
      } else {
        console.warn('[Estrutura] loteId não encontrado na URL/estado de navegação.');
      }

      this.paramCache = params;

      console.log('[Estrutura] Parâmetros recebidos:', params);
      console.log('[Estrutura] denominacaoImovel dos params:', params['denominacaoImovel']);
      
      this.formEstrutura.patchValue({
        id: params['id'] ? +params['id'] : null,
        municipioId: params['municipioId'] ? +params['municipioId'] : null,
        loteId: params['loteId'] ? +params['loteId'] : null,
        numero: params['numero'] ?? '',
        area: params['area'] ? +params['area'] : null,
        denominacaoImovel: params['denominacaoImovel'] || '',
        sncr: params['sncr'] ?? '',
        situacaoJuridicaId: params['situacaoJuridicaId'] ?? null,
        // Campos de localização ficam em branco para serem preenchidos
        localidade: '',
        comunidade: '',
        pontoDeReferencia: '',
      });
      
      console.log('[Estrutura] Formulário após aplicar params:', this.formEstrutura.getRawValue());

      if (params['municipioId']) {
        this.distritoService.getDistritosByMunicipio(+params['municipioId']).subscribe(distritos => {
          this.filteredDistritos = distritos;
          const distritoIdParam = params['distritoId'] ? Number(params['distritoId']) : null;
          if (distritoIdParam) {
            this.formEstrutura.get('distritoId')?.enable();
            this.formEstrutura.patchValue({ distritoId: distritoIdParam });
            // mantém campo habilitado para edição
          }
        });
      }
    });

    // Carrega situações jurídicas
    this.carregarSituacoesJuridicas();
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

  getMunicipioNomeByLote(lote: any): string {
    if (!lote || !lote.municipioId) return 'Sem município';
    const municipio = this.municipios.find(m => m.id === lote.municipioId);
    return municipio ? municipio.nome : 'Município não encontrado';
  }

  onMunicipioChange(municipioId: number): void {
    this.loadDistritosByMunicipio(municipioId);
    this.lotesFiltrados = this.lotes.filter(l => l.municipioId === municipioId);
  }

  onLoteChange(loteId: number): void {
    const lote = this.lotes.find(l => l.id === loteId);
    if (lote) {
      this.formEstrutura.patchValue({
        numero: lote.numero,
        municipioId: lote.municipioId,
        distritoId: lote.distritoId,
        denominacaoImovel: lote.denominacaoImovel,
        area: lote.area,
        sncr: lote.sncr
      });
      if (lote.municipioId) {
        this.loadDistritosByMunicipio(lote.municipioId);
      }
    }
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
      next: (res) => {
        this.lotes = res;
      },
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

        console.log('[Estrutura] DTO recebido do serviço:', estruturaDTO);
        console.log('[Estrutura] 🔍 ID da estrutura:', estruturaDTO.id);
        console.log('[Estrutura] 🔍 Dados de forma de obtenção na estrutura:');
        console.log('[Estrutura] 🔍 - descricaoFormaDeObtencao:', estruturaDTO.descricaoFormaDeObtencao);
        console.log('[Estrutura] 🔍 - areaMedida:', estruturaDTO.areaMedida, 'tipo:', typeof estruturaDTO.areaMedida);
        console.log('[Estrutura] 🔍 - dataPosse:', estruturaDTO.dataPosse, 'tipo:', typeof estruturaDTO.dataPosse);
        console.log('[Estrutura] 🔍 - formaObtencaoId:', estruturaDTO.formaObtencaoId);
        console.log('[Estrutura] 🔍 - Todos os campos do DTO:', Object.keys(estruturaDTO));
        console.log('[Estrutura] 🔍 - indicacaoLocalizacao no DTO:', estruturaDTO.indicacaoLocalizacao);
        console.log('[Estrutura] 🔍 - pontoDeReferencia no DTO:', (estruturaDTO as any).pontoDeReferencia);
        console.log('[Estrutura] 🔍 - localidade no DTO:', estruturaDTO.localidade);
        console.log('[Estrutura] 🔍 - comunidade no DTO:', estruturaDTO.comunidade);

        this.loadDistritosByMunicipio(estruturaDTO.municipioId).then(() => {
          console.log('[Estrutura] Distritos carregados com sucesso');
        }).catch((error) => {
          console.warn('[Estrutura] Erro ao carregar distritos, continuando sem eles:', error);
        }).finally(() => {
          // habilita campos para preenchimento
          this.formEstrutura.get('municipioId')?.enable();
          this.formEstrutura.get('distritoId')?.enable();
          this.formEstrutura.get('numero')?.enable();
          this.formEstrutura.get('denominacaoImovel')?.enable();

          const formValue = estruturaDTOToFormValue(estruturaDTO);
          console.log('[Estrutura] Valores mapeados para o form:', formValue);
          
          // Aplica TODOS os dados da estrutura no formulário
          this.formEstrutura.patchValue(formValue);

          console.log('[Estrutura] Formulário após aplicar dados da estrutura:', this.formEstrutura.getRawValue());
          console.log('[Estrutura] 🔍 ID no formulário após aplicar dados:', this.formEstrutura.get('id')?.value);
          console.log('[Estrutura] 🔍 isAtualizando após aplicar dados:', this.isAtualizando);

          // Se o loteId está presente, carrega os dados do lote APENAS para campos que não estão na estrutura
          console.log('[Estrutura] Verificando loteId:', estruturaDTO.loteId);
          if (estruturaDTO.loteId) {
            console.log('[Estrutura] Carregando dados do lote com ID:', estruturaDTO.loteId);
            this.loteService.obterPorId(estruturaDTO.loteId).subscribe({
              next: (lote) => {
                console.log('[Estrutura] Dados do lote carregados:', lote);
                console.log('[Estrutura] denominacaoImovel do lote:', lote.denominacaoImovel);
                
                // Só atualiza campos que não estão preenchidos na estrutura
                const currentFormValue = this.formEstrutura.getRawValue();
                const loteData: any = {};
                
                console.log('[Estrutura] Valores atuais do formulário antes de aplicar dados do lote:', currentFormValue);
                
                // Só preenche se não estiver preenchido na estrutura (verifica se é null, undefined ou string vazia)
                if ((!currentFormValue.numero || currentFormValue.numero === '') && lote.numero) {
                  loteData.numero = lote.numero;
                }
                if ((!currentFormValue.municipioId || currentFormValue.municipioId === null) && lote.municipioId) {
                  loteData.municipioId = lote.municipioId;
                }
                if ((!currentFormValue.distritoId || currentFormValue.distritoId === null) && lote.distritoId) {
                  loteData.distritoId = lote.distritoId;
                }
                // Sempre aplica denominacaoImovel e sncr do lote (campos específicos do lote)
                if (lote.denominacaoImovel) {
                  loteData.denominacaoImovel = lote.denominacaoImovel;
                }
                if (lote.sncr) {
                  loteData.sncr = lote.sncr;
                }
                // Sempre aplica situacaoJuridicaId do lote
                if (lote.situacaoJuridicaId) {
                  loteData.situacaoJuridicaId = lote.situacaoJuridicaId;
                }
                if ((!currentFormValue.area || currentFormValue.area === null) && lote.area) {
                  loteData.area = lote.area;
                }
                
                // Aplica apenas os campos que não estão preenchidos
                if (Object.keys(loteData).length > 0) {
                  console.log('[Estrutura] Aplicando dados do lote que não estão na estrutura:', loteData);
                  this.formEstrutura.patchValue(loteData);
                } else {
                  console.log('[Estrutura] Nenhum dado do lote será aplicado - todos os campos já estão preenchidos na estrutura');
                }
                
                console.log('[Estrutura] Formulário final após carregar dados do lote:', this.formEstrutura.getRawValue());
              },
              error: (err) => {
                console.error('[Estrutura] Erro ao carregar dados do lote:', err);
              }
            });
          } else {
            console.log('[Estrutura] Nenhum loteId encontrado, pulando carregamento de dados do lote');
          }

          // ✅ CORREÇÃO: Dados já estão na estrutura, não precisa carregar separadamente
          console.log('[Estrutura] Dados de endereço e forma de obtenção já estão na estrutura, pulando carregamento separado');

          // mantém campos habilitados para edição
          console.log('[Estrutura] DTO aplicado no form:', this.formEstrutura.getRawValue());
        }); // Fecha o bloco finally
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

  carregarFormaObtencao(loteId: number) {
    console.log('[Estrutura] Carregando forma de obtenção para lote:', loteId);
    this.formaObtencaoService.buscarPorLoteId(loteId).subscribe({
      next: (formaObtencaoDTO) => {
        console.log('[Estrutura] Forma de obtenção carregada:', formaObtencaoDTO);
        console.log('[Estrutura] descricaoFormaDeObtencao recebida:', formaObtencaoDTO.descricaoFormaDeObtencao);
        console.log('[Estrutura] areaMedida recebida:', formaObtencaoDTO.areaMedida, 'tipo:', typeof formaObtencaoDTO.areaMedida);
        console.log('[Estrutura] dataPosse recebida:', formaObtencaoDTO.dataPosse, 'tipo:', typeof formaObtencaoDTO.dataPosse);
        console.log('[Estrutura] formaObtencaoId recebido:', formaObtencaoDTO.id);
        console.log('[Estrutura] Todos os campos recebidos:', Object.keys(formaObtencaoDTO));
        
        // Mapeia a descrição da forma de obtenção corretamente
        let descricaoForma = formaObtencaoDTO.descricaoFormaDeObtencao || '';
        let codigoForma = null;
        
        // Se a descrição está vazia, mantém vazio (não tenta mapear pelo ID da tabela)
        if (descricaoForma) {
          // Se tem descrição, mapeia para o código correspondente
          const opcao = this.obtencoes.find(o => o.viewValue === descricaoForma);
          codigoForma = opcao ? opcao.value : null;
        }
        
        console.log('[Estrutura] 🔍 Mapeamento forma de obtenção por loteId:');
        console.log('[Estrutura] 🔍 - loteId:', loteId);
        console.log('[Estrutura] 🔍 - ID da tabela forma_obtencao:', formaObtencaoDTO.id);
        console.log('[Estrutura] 🔍 - Descrição original do banco:', formaObtencaoDTO.descricaoFormaDeObtencao);
        console.log('[Estrutura] 🔍 - Descrição mapeada:', descricaoForma);
        console.log('[Estrutura] 🔍 - Código mapeado:', codigoForma);
        
        // Aplica os dados da forma de obtenção no formulário, mas só preenche campos vazios
        const currentFormValue = this.formEstrutura.getRawValue();
        const formaObtencaoData: any = {};
        
        // Só preenche se o campo estiver vazio na estrutura
        if (!currentFormValue.formaObtencaoId && codigoForma) {
          formaObtencaoData.formaObtencaoId = codigoForma;
        }
        if (!currentFormValue.descricaoFormaDeObtencao && descricaoForma) {
          formaObtencaoData.descricaoFormaDeObtencao = descricaoForma;
        }
        if (!currentFormValue.livro && formaObtencaoDTO.livro) {
          formaObtencaoData.livro = formaObtencaoDTO.livro;
        }
        if (!currentFormValue.matricula && formaObtencaoDTO.matricula) {
          formaObtencaoData.matricula = formaObtencaoDTO.matricula;
        }
        if (!currentFormValue.nomeCartorio && formaObtencaoDTO.nomeCartorio) {
          formaObtencaoData.nomeCartorio = formaObtencaoDTO.nomeCartorio;
        }
        if (!currentFormValue.municipioCartorio && formaObtencaoDTO.municipioCartorio) {
          formaObtencaoData.municipioCartorio = formaObtencaoDTO.municipioCartorio;
        }
        if (!currentFormValue.dataRegistro && formaObtencaoDTO.dataRegistro) {
          formaObtencaoData.dataRegistro = formaObtencaoDTO.dataRegistro;
        }
        if (!currentFormValue.numeroRegistro && formaObtencaoDTO.numeroRegistro) {
          formaObtencaoData.numeroRegistro = formaObtencaoDTO.numeroRegistro;
        }
        if (!currentFormValue.areaRegistrada && formaObtencaoDTO.areaRegistrada) {
          formaObtencaoData.areaRegistrada = formaObtencaoDTO.areaRegistrada;
        }
        if (!currentFormValue.areaMedida && formaObtencaoDTO.areaMedida) {
          formaObtencaoData.areaMedida = formaObtencaoDTO.areaMedida;
        }
        if (!currentFormValue.areaPosse && formaObtencaoDTO.areaMedida) {
          formaObtencaoData.areaPosse = Number(formaObtencaoDTO.areaMedida);
        }
        if (!currentFormValue.dataPosse && formaObtencaoDTO.dataPosse) {
          formaObtencaoData.dataPosse = new Date(formaObtencaoDTO.dataPosse);
        }
        if (!currentFormValue.numeroHerdeiros && formaObtencaoDTO.numeroHerdeiros) {
          formaObtencaoData.numeroHerdeiros = formaObtencaoDTO.numeroHerdeiros;
        }
        if (!currentFormValue.oficio && formaObtencaoDTO.oficio) {
          formaObtencaoData.oficio = formaObtencaoDTO.oficio;
        }

        // Se descricaoFormaDeObtencao está vazia, mas temos outros dados, alerta o usuário
        if (!formaObtencaoDTO.descricaoFormaDeObtencao && (formaObtencaoDTO.areaMedida || formaObtencaoDTO.dataPosse)) {
          console.warn('[Estrutura] ⚠️ ATENÇÃO: Dados de forma de obtenção encontrados, mas descrição está vazia no banco!');
          console.warn('[Estrutura] 📝 Dados encontrados:', {
            areaMedida: formaObtencaoDTO.areaMedida,
            dataPosse: formaObtencaoDTO.dataPosse,
            loteId: formaObtencaoDTO.loteId
          });
          console.warn('[Estrutura] 💡 Solução: Execute o SQL para corrigir o campo descricao_forma_d no banco');
        }
        
        // Só aplica se houver dados para aplicar
        if (Object.keys(formaObtencaoData).length > 0) {
          console.log('[Estrutura] Aplicando dados da forma de obtenção:', formaObtencaoData);
          this.formEstrutura.patchValue(formaObtencaoData);
        } else {
          console.log('[Estrutura] Nenhum dado adicional de forma de obtenção para aplicar');
        }
        
        console.log('[Estrutura] Formulário após aplicar dados da forma de obtenção:', this.formEstrutura.getRawValue());
        console.log('[Estrutura] 🔍 Verificando campos específicos:');
        console.log('[Estrutura] 🔍 - areaPosse no form:', this.formEstrutura.get('areaPosse')?.value);
        console.log('[Estrutura] 🔍 - dataPosse no form:', this.formEstrutura.get('dataPosse')?.value);
        console.log('[Estrutura] 🔍 - descricaoFormaDeObtencao no form:', this.formEstrutura.get('descricaoFormaDeObtencao')?.value);
      },
      error: (err) => {
        if (err?.status === 404) {
          console.log('[Estrutura] ✅ 404: Nenhuma forma de obtenção cadastrada para o lote', loteId);
          console.log('[Estrutura] 📝 Os campos de forma de obtenção ficarão vazios para preenchimento manual');
          
          // Limpa os campos relacionados à forma de obtenção para garantir que estejam vazios
          const camposVazios = {
            descricaoFormaDeObtencao: '',
            livro: '',
            matricula: '',
            nomeCartorio: '',
            municipioCartorio: '',
            dataRegistro: null,
            numeroRegistro: '',
            areaRegistrada: null,
            areaMedida: null,
            areaPosse: null,
            dataPosse: null,
            numeroHerdeiros: null,
            oficio: '',
          };
          
          this.formEstrutura.patchValue(camposVazios);
          console.log('[Estrutura] 🔄 Campos de forma de obtenção limpos para preenchimento manual');
        } else {
          console.error('[Estrutura] ❌ Erro inesperado ao carregar forma de obtenção:', err);
          console.error('[Estrutura] 🔍 Detalhes do erro:', {
            status: err?.status,
            statusText: err?.statusText,
            ok: err?.ok,
            url: err?.url
          });
        }
      }
    });
  }

  carregarEnderecoLote(loteId: number) {
    console.log('[Estrutura] Carregando endereço do lote:', loteId);
    this.enderecoLoteService.buscarPorLoteId(loteId).subscribe({
      next: (enderecoDTO) => {
        console.log('[Estrutura] Endereço do lote carregado:', enderecoDTO);
        
        // Aplica os dados do endereço no formulário, mas só preenche campos vazios
        const currentFormValue = this.formEstrutura.getRawValue();
        const enderecoData: any = {};
        
        if (!currentFormValue.localidade && enderecoDTO.localidade) {
          enderecoData.localidade = enderecoDTO.localidade;
        }
        if (!currentFormValue.comunidade && enderecoDTO.comunidade) {
          enderecoData.comunidade = enderecoDTO.comunidade;
        }
        if (!currentFormValue.pontoDeReferencia && enderecoDTO.pontoDeReferencia) {
          enderecoData.pontoDeReferencia = enderecoDTO.pontoDeReferencia;
        }
        if (!currentFormValue.codImoReceita && enderecoDTO.codImoReceita) {
          enderecoData.codImoReceita = enderecoDTO.codImoReceita;
        }
        
        // Só aplica se houver dados para aplicar
        if (Object.keys(enderecoData).length > 0) {
          console.log('[Estrutura] Aplicando dados do endereço:', enderecoData);
          this.formEstrutura.patchValue(enderecoData);
        } else {
          console.log('[Estrutura] Nenhum dado adicional de endereço para aplicar');
        }
        
        console.log('[Estrutura] Formulário após aplicar dados do endereço:', this.formEstrutura.getRawValue());
      },
      error: (err) => {
        if (err?.status === 404) {
          console.log('[Estrutura] Nenhum endereço encontrado para o lote', loteId);
        } else {
          console.error('[Estrutura] Erro ao carregar endereço do lote:', err);
        }
      }
    });
  }

  carregarSituacoesJuridicas() {
    console.log('[Estrutura] Carregando situações jurídicas...');
    this.situacaoJuridicaService.getAll().subscribe({
      next: (situacoes) => {
        console.log('[Estrutura] Situações jurídicas carregadas:', situacoes);
        this.situacoes = situacoes.map(s => {
          // Extrai o nome da situação baseado no ID
          let nome = '';
          switch (s.id) {
            case 1:
              nome = 'Posse por Simples Ocupação';
              break;
            case 2:
              nome = 'Posse a Justo Título';
              break;
            case 3:
              nome = 'Área Registrada (Domínio)';
              break;
            case 99:
              nome = 'Indefinido';
              break;
            default:
              nome = `Situação ${s.id}`;
          }
          
          return {
            value: s.id || 0,
            viewValue: nome
          };
        });
        console.log('[Estrutura] Situações mapeadas:', this.situacoes);
        
        // Após carregar as situações, verifica se há um valor pendente para aplicar
        this.aplicarSituacaoJuridicaPendente();
      },
      error: (err) => {
        console.error('[Estrutura] Erro ao carregar situações jurídicas:', err);
        // Fallback para valores hardcoded em caso de erro
        this.situacoes = [
          { value: 1, viewValue: 'Posse Por Simples Ocupação' },
          { value: 2, viewValue: 'Posse a Justo Título' },
          { value: 3, viewValue: 'Área Registrada (Domínio)' },
          { value: 99, viewValue: 'Indefinido' },
        ];
        
        // Aplica valor pendente mesmo com fallback
        this.aplicarSituacaoJuridicaPendente();
      }
    });
  }

  private aplicarSituacaoJuridicaPendente() {
    // Verifica se há um valor de situacaoJuridicaId nos parâmetros da URL
    if (this.paramCache && this.paramCache['situacaoJuridicaId']) {
      const situacaoId = +this.paramCache['situacaoJuridicaId'];
      console.log('[Estrutura] Aplicando situacaoJuridicaId pendente:', situacaoId);
      console.log('[Estrutura] Situações disponíveis no momento:', this.situacoes);
      console.log('[Estrutura] Valor atual do form antes:', this.formEstrutura.get('situacaoJuridicaId')?.value);
      
      this.formEstrutura.patchValue({ situacaoJuridicaId: situacaoId });
      
      console.log('[Estrutura] Valor atual do form depois:', this.formEstrutura.get('situacaoJuridicaId')?.value);
      
      // Força detecção de mudanças para garantir que o UI seja atualizado
      setTimeout(() => {
        console.log('[Estrutura] Verificando valor após timeout:', this.formEstrutura.get('situacaoJuridicaId')?.value);
      }, 100);
    }
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

    console.log('[Estrutura] 🔍 Formulário antes de mapear para DTO:', this.formEstrutura.getRawValue());
    console.log('[Estrutura] 🔍 Campos de forma de obtenção no form:');
    console.log('[Estrutura] 🔍 - formaObtencaoId:', this.formEstrutura.get('formaObtencaoId')?.value);
    console.log('[Estrutura] 🔍 - descricaoFormaDeObtencao:', this.formEstrutura.get('descricaoFormaDeObtencao')?.value);
    console.log('[Estrutura] 🔍 - pontoDeReferencia no form:', this.formEstrutura.get('pontoDeReferencia')?.value);

    const dto = mapFormToEstruturaDTO(this.formEstrutura);
    
    console.log('[Estrutura] 🔍 DTO mapeado para envio:', dto);
    console.log('[Estrutura] 🔍 Campos de forma de obtenção no DTO:');
    console.log('[Estrutura] 🔍 - formaObtencaoId:', dto.formaObtencaoId);
    console.log('[Estrutura] 🔍 - descricaoFormaDeObtencao:', dto.descricaoFormaDeObtencao);
    console.log('[Estrutura] 🔍 Campos de localização no DTO:');
    console.log('[Estrutura] 🔍 - indicacaoLocalizacao:', dto.indicacaoLocalizacao);
    console.log('[Estrutura] 🔍 - pontoDeReferencia:', (dto as any).pontoDeReferencia);
    console.log('[Estrutura] 🔍 - localidade:', dto.localidade);
    console.log('[Estrutura] 🔍 - comunidade:', dto.comunidade);

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

    // Não preencher descricaoFormaDeObtencao automaticamente

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
