import { ChangeDetectionStrategy, Component, Input, OnInit, signal, NgZone } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { CondicaoPessoaImovel } from '../enums/enum-condicao-pessoa-imovel.enum';
import { CadastroPessoasAnexoComponent } from '../cadastro-pessoas-anexo/cadastro-pessoas-anexo.component';
import { CadastroDocumentoPessoaComponent } from '../cadastro-documento-pessoa/cadastro-documento-pessoa.component';
import { PessoasService } from '../services/pessoa.service';
import { Municipio } from '../models/municipio';
import { EstadoService } from '../services/estado.service';
import { MunicipioService } from '../services/municipio.service';
import { ErrorStateMatcher, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CadastroPessoaLoteComponent } from '../cadastro-pessoa-lote/cadastro-pessoa-lote.component';
import { ActivatedRoute, Router } from '@angular/router';
import { LoteService } from '../services/lote.service';
import { PessoaLoteDTO } from '../models/pessoa-lote.dto';
import { PessoaLoteService } from '../services/pessoa-lote.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { documentoToForm, toggleControls } from '../helpers/documentos-pessoa-mapper';
import { CadastroEnderecoPessoaComponent } from "../cadastro-endereco-pessoa/cadastro-endereco-pessoa.component";
import { EditarDetentorResponseDTO } from '../models/editar-detentor-response-dto';
import { ChangeDetectorRef } from '@angular/core';
import { enderecoToForm, pessoaToFormFisica, pessoaToFormPessoas } from '../helpers/pessoa-mapper';
import { BackButtonComponent } from '../shared/components/back-button/back-button.component';
import { Location } from '@angular/common';

interface distrito {
  value: string;
  viewValue: string;
}

interface litigio {
  value: string;
  viewValue: string;
}

interface sexo {
  value: string;
  viewValue: string;
}

interface raca {
  value: string;
  viewValue: string;
}

interface estadoCivil {
  value: string;
  viewValue: string;
}

interface regimeBens {
  value: string;
  viewValue: string;
}

interface tipoDocumento {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-cadastro-pessoas',
  imports: [
    CommonModule,
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
    ReactiveFormsModule,
    MatIconModule,
    CadastroPessoasAnexoComponent,
    CadastroDocumentoPessoaComponent,
    CadastroEnderecoPessoaComponent,
    CadastroPessoaLoteComponent,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    BackButtonComponent
  ],
  templateUrl: './cadastro-pessoas.component.html',
  styleUrl: './cadastro-pessoas.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CadastroPessoasComponent implements OnInit {

  atualizando = false;

  errorStateMatcher: ErrorStateMatcher = {
    isErrorState: (control) => !!(control && control.invalid && control.touched),
  };

  programas = [
    { id: 1, nome: 'Bolsa Família' },
    { id: 2, nome: 'Bolsa Safra' }
    // ...etc
  ];


  distritos: distrito[] = [
    { value: 'Distrito teste 1', viewValue: 'Teste 1' },
    { value: 'Distrito teste 2', viewValue: 'Teste 2' },
    { value: 'Distrito teste 3', viewValue: 'Teste 3' },
  ];

  litigios: litigio[] = [
    { value: 'AreaComPosseiros', viewValue: '09 - Área com Posseiros' },
    { value: 'Limite', viewValue: '17 - Questão de Limite' },
    { value: 'Titulacao', viewValue: '25 - Questão de Titulação' },
  ];

  sexos: sexo[] = [
    { value: 'Masculino', viewValue: 'Masculino' },
    { value: 'Feminino', viewValue: 'Feminino' },
  ];

  racas: raca[] = [
    { value: 'branca', viewValue: 'Branca' },
    { value: 'preta', viewValue: 'Preta' },
    { value: 'parda', viewValue: 'Parda' },
    { value: 'indigena', viewValue: 'Indígena' },
    { value: 'amarela', viewValue: 'Amarela' },
  ];

  estadosCivis: estadoCivil[] = [
    { value: 'solteiro', viewValue: '1 - Solteiro(a)' },
    { value: 'casado', viewValue: '3 - Casado(a)' },
    { value: 'viuvo', viewValue: '5 - Viúvo(a)' },
    { value: 'desquitado', viewValue: '7 - Desquitado(a)/Sep. Judicial' },
    { value: 'divorciado', viewValue: '9 - Divorciado(a)' },
    { value: 'uniaoEstavel', viewValue: '11 - União Estável' },
  ];

  regimesBens: regimeBens[] = [
    { value: 'comunhaoParcial', viewValue: 'Comunhão Parcial de Bens' },
    { value: 'comunhaoUniversal', viewValue: 'Comunhão Universal de Bens' },
    { value: 'separacaoTotal', viewValue: 'Separação Total de Bens' },
    { value: 'naoInformado', viewValue: 'Não Informado' },
  ];

  tiposDocumentos: tipoDocumento[] = [
    { value: 'carteiraIdentidade', viewValue: '2 - Carteira de Identidade' },
    { value: 'carteiraTrabalho', viewValue: '4 - Carteira de Trabalho' },
    { value: 'carteiraEstrangeiro', viewValue: '6 - Carteira de Estrangeiro' },
    { value: 'outro', viewValue: '8 - Outro' },
  ];

  tiposPessoas = [
    { value: 'FISICA', viewValue: 'Física' },
    { value: 'JURIDICA', viewValue: 'Jurídica' }
  ];

  tiposPoderes = [
    { value: 'E - Executivo', viewValue: 'E - Executivo' },
    { value: 'L - Legislativo', viewValue: 'L - Legislativo' },
    { value: 'J - Judiciário', viewValue: 'J - Judiciário' }
  ];

  tiposGovernos = [
    { value: 'E - Executivo', viewValue: 'E - Executivo' },
    { value: 'L - Legislativo', viewValue: 'L - Legislativo' },
    { value: 'J - Judiciário', viewValue: 'J - Judiciário' }
  ];

  nacionalidades = [
    { value: 'brasileira', viewValue: 'Brasileira' },
    { value: 'estrangeira', viewValue: 'Estrangeira' }
  ];

  condicoesPessoaImovel = [
    { value: CondicaoPessoaImovel.ProprietarioPosseiroIndividual, label: '12 - Proprietário ou Posseiro Individual' },
    { value: CondicaoPessoaImovel.ProprietarioPosseiroComum, label: '14 - Proprietário ou Posseiro Comum' },
    { value: CondicaoPessoaImovel.Usufrutario, label: '16 - Usufrutário' },
    { value: CondicaoPessoaImovel.NuProprietario, label: '18 - Nu-Proprietário' },
    { value: CondicaoPessoaImovel.Parceiro, label: '20 - Parceiro' },
    { value: CondicaoPessoaImovel.Arrendatario, label: '22 - Arrendatário' },
    { value: CondicaoPessoaImovel.Comodatario, label: '24 - Comodatário' },
    { value: CondicaoPessoaImovel.Concessionario, label: '26 - Concessionário' },
  ];

  // atividades = [
  //   { value: 'agricola', viewValue: '1 - Agrícola' },
  //   { value: 'pecuaria', viewValue: '3 - Pecuária' },
  //   { value: 'granjeira', viewValue: '5 - Granjeira' }
  // ];

  tiposContratos = [
    { value: 'escrito', viewValue: 'Escrito' },
    { value: 'verbal', viewValue: 'Verbal' },
  ];

  PF_DOC_KEYS: string[] = [
    'cpf', 'estadoCivil', 'tipoNacionalidade', 'ufNaturalidade',
    'naturalidadeId', 'codigoPaisOrigem', 'codigoPaisResidencia'
  ];

  PJ_DOC_KEYS: string[] = [
    'cnpj', 'naturezaJuridica', 'tipoDePoder', 'tipoDeGoverno',
    'ufPaisSede', 'codigoPaisSede', 'capitalNacional', 'capitalEstrangeiro',
    'registroJuntaComercial', 'nomeFantasia', 'percentCapitalNacional',
    'percentCapitalEstrangeiro', 'pcePais', 'pcePercentCapital'
  ];

  pessoaLoteIdEmEdicao: number | null = null;

  ufs: string[] = [];
  municipios: Municipio[] = [];
  isLoadingUf = false;
  isLoadingMunicipio = false;
  @Input() loteId: number | null = null;
  numero: string = '';
  //programas: ProgramaGovernoDTO[] = [];

  // Lista de pessoas vinculadas ao lote
  pessoasVinculadas: any[] = [];
  isLoadingPessoas = false;
  modoAdicionarNova = false;

  tipoPessoaSelecionada = signal<string>('FISICA');

  formPessoas: FormGroup;
  formFisica: FormGroup;
  formJuridica: FormGroup;
  formPessoaLote: FormGroup;
  formAnexo: FormGroup;
  formEnderecoPessoa: FormGroup;
  formDocumentoPessoa: FormGroup;
  formVinculacao: FormGroup;

  constructor(
    private fb: FormBuilder,
    private pessoasService: PessoasService,
    private loteService: LoteService,
    private municipioService: MunicipioService,
    private route: ActivatedRoute,
    private pessoaLoteService: PessoaLoteService,
    private snackBar: MatSnackBar,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private location: Location,
    private ngZone: NgZone
  ) {

    this.formAnexo = this.fb.group({
      coordenadaEste: [''],
      coordenadaNorte: [''],
      atividadePrincipal: [''],
      isRecebePronaf: [false],
      qtdPronaf: [0],
      tiposPronaf: [[]],
      valorTotalPronafs: [''],
      recebeProgramaGoverno: [false],
      //programasSelecionados: [[]],
    });

    this.formPessoas = this.fb.group({
      municipioId: [null, Validators.required],
      loteId: [null, Validators.required],
      nome: ['', Validators.required],
      endereco: [''],
      numero: [''],
      complemento: [''],
      bairro: [''],
      municipio: [''],
      uf: [''],
      cep: [''],
      telefone: [''],
      email: [''],
      tipoPessoa: [this.tipoPessoaSelecionada()],
      ramal: [''],
      //observacoes: [''] // Adicionado campo de observações
    });

    this.formFisica = this.fb.group({
      cpf: [''],
      dataNascimento: [''],
      sexoPessoa: [''], // Alterado de sexoPessoa para sexo
      isEspolio: [false],
      racaCor: [''],
      estadoCivil: [''], // ✅ ADICIONADO DE VOLTA
      dataCasamento: [''],
      regimeBens: [''], // Regime de bens
      escolaridade: [''], // Adicionado
      profissao: [''], // Adicionado
      tipoDocumento: [''],
      numeroDocumento: [''],
      orgaoEmissor: [''],
      ufOrgaoEmissor: [''],
      nacionalidade: [''],
      ufNaturalidade: [''],
      municipioNaturalidade: [''],
      codigoPaisOrigem: [''],
      codigoPaisResidencia: [''],
      nomePai: [''],
      nomeMae: [''],
    });

    this.formJuridica = this.fb.group({
      cnpj: [''],
      razaoSocial: [''], // Adicionado
      nomeFantasia: [''], // Adicionado
      naturezaJuridica: [''],
      capitalNacional: [''],
      capitalEstrangeiro: [''],
      registroJuntaComercial: [''],
      tipoPoder: [''],
      tipoGoverno: [''],
      ufPaisSede: [''],
      codigoPaisSede: [''],
    });

    this.formVinculacao = this.fb.group({
      condicaoImovel: [''],
      porcentagemDetencao: [''],
      isDeclarante: [false],
      resideImovel: [false],
      areaCedida: [''],
      titularidadeIndenizado: [false],
      tipoContrato: [''],
      nomeAto: [''],
      dataAto: [''],
      utmBase: [''],
      utmNorte: [''],
      atividadePrincipal: [''],
      recebePronaf: [false],
      recebeProgramaGoverno: [false],
      quotas: [''],
      programasGoverno: [[]],
      valorTotal: [''],
    });

    this.formPessoaLote = this.fb.group({
      loteId: [null, Validators.required],
      numero: [{ value: '', disabled: true }],
      condicaoPessoaImovelRural: [''],
      percentDetencao: [null],
      isDeclarante: [false],
      isResideNoImovel: [false],
      atividadePrincipalExploracao: [null],
      qtdAreaCedida: [null],
      terminoContrato: [null],
      tipoContrato: [null],
      tiposAtos: [null],
      numeroAto: [null],
      dataAto: [null],
      isContratoPrazoIndeterminado: [false],
      dataTerminoContrato: ['']
    });

    this.formEnderecoPessoa = this.fb.group({
      logradouro: [''],
      complemento: [''],
      numero: [''],
      bairro: [''],
      cep: [''],
      codigoPaisResidencia: [''],
      municipioId: [null],
      uf: ['']
    });

    this.formDocumentoPessoa = this.fb.group({
      id: [null],
      pessoaId: [null], // será preenchido no backend ou depois do POST da pessoa

      // Identificação
      tipoDocumentoIdentificacao: [''],
      numeroDocumentoIdentificacao: [''],
      orgaoEmissor: [''],
      ufOrgaoEmissor: [''],

      // Nacionalidade / naturalidade
      tipoNacionalidade: [''],              // <mat-select> Nacionalidade
      ufNaturalidade: [''],                 // UF para escolher município
      naturalidadeId: [null],               // id do município de naturalidade
      codigoPaisOrigem: [''],
      //codigoPaisResidencia: [''],

      // Pessoa Física / Jurídica (alguns podem permanecer vazios dependendo do tipo)
      cpf: [''],
      cnpj: [''],
      estadoCivil: [''],
      tipoPessoa: [''],                     // PF ou PJ (vamos preencher no submit)
      naturezaJuridica: [''],

      // PJ extra
      capitalNacional: [null],
      capitalEstrangeiro: [null],
      registroJuntaComercial: [''],
      nomeFantasia: [''],
      codigoPaisSede: [''],
      ufPaisSede: [''],
      tipoDocumentoRepresentanteLegal: [''],
      numeroDocumentoRepresentanteLegal: [''],
      tipoDePoder: [''],
      tipoDeGoverno: [''],
      percentCapitalNacional: [null],
      percentCapitalEstrangeiro: [null],
      pcePais: [''],
      pcePercentCapital: [null],

      obsevacoesQuadro7: ['']
    });


    // Atualiza signal quando troca tipo
    this.formPessoas.get('tipoPessoa')?.valueChanges.subscribe(tp => {
      this.tipoPessoaSelecionada.set(tp);
    });
  }



  ngOnInit(): void {
    this.loadUfs();
    // modo inicial
    const tp0 = (this.formPessoas.get('tipoPessoa')?.value ?? 'FISICA') as 'FISICA' | 'JURIDICA';
    this.applyTipoPessoaMode(tp0);

    // reagir a mudanças
    this.formPessoas.get('tipoPessoa')?.valueChanges.subscribe((tp: 'FISICA' | 'JURIDICA') => {
      this.tipoPessoaSelecionada.set(tp);
      this.applyTipoPessoaMode(tp);
    });

    this.route.queryParams.subscribe(params => {

      const loteId = Number(params['loteId'] ?? this.route.snapshot.queryParamMap.get('loteId'));
      if (!loteId) return;

      this.formPessoaLote.get('loteId')?.setValue(loteId);
      
      // Carregar lista de pessoas vinculadas ao lote
      this.carregarPessoasVinculadas(loteId);
      
      // Carrega dados do lote (incluindo CPF para sincronização)
      this.loteService.obterPorId(loteId).subscribe({
        next: (lote) => {
          this.numero = lote.numero;
          console.log('[Pessoas] Dados do lote carregados:', lote);
          console.log('[Pessoas] CPF do lote:', lote.cpf);
          
          // Tenta carregar dados da pessoa existente
      this.pessoasService.buscarParaEdicaoPorLote(loteId).subscribe({
            next: (resp) => {
              console.log('[Pessoas] ✅ Dados carregados para edição:', resp);
              console.log('[Pessoas] 🔄 Ativando modo ATUALIZAÇÃO');
              this.atualizando = true;
              this.patchAll(resp);
              this.cdr.markForCheck();
            },
        error: (err) => {
              // sem vínculo => permanece em modo "Salvar" e pré-preenche CPF do lote
              if (err.status === 404) {
                console.log('[Pessoas] Nenhuma pessoa encontrada para o lote', loteId, '- Modo SALVAR');
                
                // Pré-preenche dados do lote (sem verificação de CPF existente)
                this.preencherDadosNovoDetentor(lote);
              } else {
                console.error('[Pessoas] Erro ao carregar edição por lote:', err);
              }
          this.atualizando = false;
              this.cdr.markForCheck();
            }
          });
        },
        error: (err) => {
          console.error('[Pessoas] Erro ao carregar dados do lote:', err);
          this.cdr.markForCheck();
        }
      });
    });
    ['cpf', 'cnpj', 'estadoCivil', 'tipoNacionalidade', 'ufNaturalidade', 'naturalidadeId', 'codigoPaisOrigem', 'codigoPaisResidencia']
      .forEach(k => {
        if (!this.formDocumentoPessoa.get(k)) {
          this.formDocumentoPessoa.addControl(k, new FormControl(''));
        }
      });
  }

  private ibgeToUF(id: number | null | undefined): string | null {
    if (!id) return null;
    const d2 = String(id).slice(0, 2);
    const map: Record<string, string> = {
      '11': 'RO', '12': 'AC', '13': 'AM', '14': 'RR', '15': 'PA', '16': 'AP', '17': 'TO',
      '21': 'MA', '22': 'PI', '23': 'CE', '24': 'RN', '25': 'PB', '26': 'PE', '27': 'AL', '28': 'SE', '29': 'BA',
      '31': 'MG', '32': 'ES', '33': 'RJ', '35': 'SP',
      '41': 'PR', '42': 'SC', '43': 'RS',
      '50': 'MS', '51': 'MT', '52': 'GO', '53': 'DF'
    };
    return map[d2] ?? null;
  }

  private patchAll(resp: EditarDetentorResponseDTO) {
    console.log('[Pessoas] 🔍 Debug patchAll - dados recebidos:', resp);
    
    // Pessoa
    if (resp.pessoa) {
      console.log('[Pessoas] 🔍 Aplicando dados da pessoa:', resp.pessoa);
      const pessoaFormData = pessoaToFormPessoas(resp.pessoa);
      const fisicaFormData = pessoaToFormFisica(resp.pessoa);
      
      console.log('[Pessoas] 🔍 Dados mapeados para formPessoas:', pessoaFormData);
      console.log('[Pessoas] 🔍 Dados mapeados para formFisica:', fisicaFormData);
      
      this.formPessoas.patchValue(pessoaFormData, { emitEvent: false });
      this.formFisica.patchValue(fisicaFormData, { emitEvent: false });
      
      this.formAnexo.patchValue({
        coordenadaEste: resp.pessoa.coordenadaEste ?? '',
        coordenadaNorte: resp.pessoa.coordenadaNorte ?? '',
        atividadePrincipal: resp.pessoa.atividadePrincipal ?? '',
        isRecebePronaf: !!resp.pessoa.isRecebePronaf,
        qtdPronaf: resp.pessoa.qtdPronaf ?? 0,
        valorTotalPronafs: resp.pessoa.valorTotalPronafs ?? null,
        recebeProgramaGoverno: !!resp.pessoa.isRecebeAjudoProgramaGoverno,
      }, { emitEvent: false });
    }
    
    // Documento - CRÍTICO: Aplicar antes do endereço para garantir que os dados sejam exibidos
    console.log('[Pessoas] 🔍 Verificando se há documento para aplicar:', resp.documento);
    if (resp.documento) {
      console.log('[Pessoas] 🔍 Aplicando dados do documento:', resp.documento);
      
      const tp = resp.documento.tipoPessoa || 'FISICA';
      this.formPessoas.get('tipoPessoa')?.setValue(tp, { emitEvent: false });
      this.applyTipoPessoaMode(tp);

      const docForm = documentoToForm(resp.documento, resp.endereco);
      console.log('[Pessoas] 🔍 Dados mapeados para formDocumentoPessoa:', docForm);
      
      // Aplica os dados do documento
      this.formDocumentoPessoa.patchValue(docForm, { emitEvent: false });
      
      // Aplicar estadoCivil do documento no formFisica também
      if (resp.documento.estadoCivil) {
        console.log('[Pessoas] 🔍 Aplicando estadoCivil do documento no formFisica:', resp.documento.estadoCivil);
        this.formFisica.patchValue({ estadoCivil: resp.documento.estadoCivil }, { emitEvent: false });
      }

      // normalizações
      const toLow = (s?: string | null) => s?.toString().trim().toLowerCase() ?? null;
      const ec = toLow(resp.documento.estadoCivil);
      const nac = toLow(resp.documento.tipoNacionalidade);
      if (ec) this.formDocumentoPessoa.patchValue({ estadoCivil: ec }, { emitEvent: false });
      if (nac) this.formDocumentoPessoa.patchValue({ tipoNacionalidade: nac }, { emitEvent: false });

      // naturalidade: garante que o subscribe do filho rode
      const natId = resp.documento.naturalidadeId ?? null;
      const ufNat = resp.documento.ufNaturalidade || this.ibgeToUF(natId);
      if (ufNat) {
        this.formDocumentoPessoa.patchValue({ ufNaturalidade: ufNat }, { emitEvent: true });
        setTimeout(() => this.formDocumentoPessoa.patchValue({ naturalidadeId: natId }, { emitEvent: false }));
      }

      // garante exibição dos códigos (como string)
      const codOrig = resp.documento.codigoPaisOrigem;
      const codResi = resp.documento.codigoPaisResidencia ?? resp.endereco?.codigoPaisResidencia;
      this.formDocumentoPessoa.get('codigoPaisOrigem')?.setValue(
        codOrig != null ? String(codOrig) : '', { emitEvent: false }
      );
      this.formDocumentoPessoa.get('codigoPaisResidencia')?.setValue(
        codResi != null ? String(codResi) : '', { emitEvent: false }
      );
      
      console.log('[Pessoas] ✅ Dados do documento aplicados com sucesso');
    } else {
      console.log('[Pessoas] ⚠️ Nenhum documento encontrado na resposta');
    }

    // Endereço - CRÍTICO: Aplicar após o documento
    if (resp.endereco) {
      console.log('[Pessoas] 🔍 Aplicando dados do endereço:', resp.endereco);
      const enderecoFormData = enderecoToForm(resp.endereco);
      console.log('[Pessoas] 🔍 Dados mapeados para formEnderecoPessoa:', enderecoFormData);
      
      // Aplica os dados do endereço
      this.formEnderecoPessoa.patchValue(enderecoFormData, { emitEvent: true });
      this.formEnderecoPessoa.get('municipioId')?.setValue(resp.endereco.municipioId ?? null, { emitEvent: false });
      
      console.log('[Pessoas] ✅ Dados do endereço aplicados com sucesso');
    }

    // Pessoa-Lote
    if (resp.pessoaLote) {
      this.pessoaLoteIdEmEdicao = resp.pessoaLote.id!;
      this.formPessoaLote.patchValue({
        loteId: resp.pessoaLote.loteId,
        condicaoPessoaImovelRural: resp.pessoaLote.condicaoPessoaImovelRural ?? null,
        percentDetencao: resp.pessoaLote.percentDetencao ?? null,
        isDeclarante: !!resp.pessoaLote.isDeclarante,
        isResideNoImovel: !!resp.pessoaLote.isResideNoImovel,
        tipoDoAto: resp.pessoaLote.tipoDoAto ?? null,
        numeroAto: resp.pessoaLote.numeroAto ?? null,
        dataAto: resp.pessoaLote.dataAto ?? null,
        quantidadeAreaCedida: resp.pessoaLote.quantidadeAreaCedida ?? null,
        atividadePrincipalExploracao: resp.pessoaLote.atividadePrincipalExploracao ?? null,
        contrato: resp.pessoaLote.contrato ?? null,
        dataTerminoContrato: resp.pessoaLote.dataTerminoContrato ?? null,
        isContratoPrazoIndeterminado: !!resp.pessoaLote.isContratoPrazoIndeterminado
      }, { emitEvent: false });
    }

    // Modo atualização ON
    this.atualizando = true;
    
    // Força detecção de mudanças após aplicar todos os dados
    this.ngZone.run(() => {
      setTimeout(() => {
        this.cdr.detectChanges();
        this.cdr.markForCheck();
        console.log('[Pessoas] ✅ Detecção de mudanças forçada no patchAll');
        
        // Log dos valores finais dos formulários para debug
        console.log('[Pessoas] 🔍 Valores finais dos formulários:');
        console.log('[Pessoas] 🔍 - formDocumentoPessoa:', this.formDocumentoPessoa.value);
        console.log('[Pessoas] 🔍 - formEnderecoPessoa:', this.formEnderecoPessoa.value);
        console.log('[Pessoas] 🔍 - formFisica:', this.formFisica.value);
        
        // Força uma segunda detecção de mudanças para garantir que a UI seja atualizada
        setTimeout(() => {
          this.cdr.detectChanges();
          this.cdr.markForCheck();
          console.log('[Pessoas] ✅ Segunda detecção de mudanças forçada no patchAll');
          
          // Terceira tentativa para garantir que a UI seja atualizada
          setTimeout(() => {
            this.cdr.detectChanges();
            this.cdr.markForCheck();
            console.log('[Pessoas] ✅ Terceira detecção de mudanças forçada no patchAll');
          }, 50);
        }, 50);
      }, 100);
    });
  }

  private applyTipoPessoaMode(tp: 'FISICA' | 'JURIDICA') {
    // espelha no form de documento (pra usar *ngIf no filho)
    this.formDocumentoPessoa.patchValue({ tipoPessoa: tp }, { emitEvent: false });

    if (tp === 'FISICA') {
      this.formFisica.enable({ emitEvent: false });
      this.formJuridica.disable({ emitEvent: false });
      this.formJuridica.reset({}, { emitEvent: false });

      toggleControls(this.formDocumentoPessoa, this.PF_DOC_KEYS, true);
      toggleControls(this.formDocumentoPessoa, this.PJ_DOC_KEYS, false, true);

      // validações chave
      this.formDocumentoPessoa.get('cpf')?.addValidators(Validators.required);
      this.formDocumentoPessoa.get('cnpj')?.clearValidators();
    } else {
      this.formJuridica.enable({ emitEvent: false });
      this.formFisica.disable({ emitEvent: false });
      this.formFisica.reset({}, { emitEvent: false });

      toggleControls(this.formDocumentoPessoa, this.PJ_DOC_KEYS, true);
      toggleControls(this.formDocumentoPessoa, this.PF_DOC_KEYS, false, true);

      this.formDocumentoPessoa.get('cnpj')?.addValidators(Validators.required);
      this.formDocumentoPessoa.get('cpf')?.clearValidators();
    }

    this.formDocumentoPessoa.get('cpf')?.updateValueAndValidity({ emitEvent: false });
    this.formDocumentoPessoa.get('cnpj')?.updateValueAndValidity({ emitEvent: false });
  }



  loadUfs(): void {
    this.isLoadingUf = true;
    this.municipioService.getUfs().subscribe({
      next: (ufs) => {
        this.ufs = ufs;
        this.isLoadingUf = false;
      },
      error: () => this.isLoadingUf = false
    });
  }

  toNumberOrNull(v: any) {
    if (v === null || v === undefined || v === '') return null;
    const n = Number(v);
    return isNaN(n) ? null : n;
  }

  onlyDigits(v: any) { return (v ?? '').toString().replace(/\D/g, ''); }


  onSalvar() {
    console.log('formPessoas:', this.formPessoas.value);
    
    // Validações básicas obrigatórias
    if (!this.formPessoaLote.get('loteId')?.value) {
      this.snackBar.open('Lote não selecionado!', 'Fechar', { duration: 3000 });
      return;
    }

    // Validar se o nome foi preenchido
    const nome = this.formPessoas.get('nome')?.value;
    if (!nome || nome.trim() === '') {
      this.snackBar.open('Nome da pessoa é obrigatório!', 'Fechar', { duration: 3000 });
      this.formPessoas.get('nome')?.markAsTouched();
      return;
    }

    // Prossegue com o salvamento
    this.executarSalvamento();
  }

  private executarSalvamento() {
    const pessoaLoteCamposData = [
      'dataAto',
      'dataTerminoContrato', // e outros campos de data
    ];
    const pessoaLotePayload = parseDateFields(this.formPessoaLote.value, pessoaLoteCamposData);

    const docRaw = this.formDocumentoPessoa.getRawValue();
    const cpfDigits = (docRaw.cpf ?? '').toString().replace(/\D/g, ''); // só números
    const documento = {
      ...docRaw,
      tipoNacionalidade: docRaw.tipoNacionalidade ?? this.formFisica.get('tipoNacionalidade')?.value ?? null,
      naturalidadeId: docRaw.naturalidadeId ?? null, // precisa ser id do município
      codigoPaisOrigem: this.onlyDigits(docRaw.codigoPaisOrigem) || docRaw.codigoPaisOrigem || null,
      codigoPaisResidencia: this.onlyDigits(docRaw.codigoPaisResidencia) || docRaw.codigoPaisResidencia || null,

      naturezaJuridica: docRaw.naturezaJuridica ?? this.formJuridica.get('naturezaJuridica')?.value ?? null,
      registroJuntaComercial: docRaw.registroJuntaComercial ?? this.formJuridica.get('regJuntaComercial')?.value ?? null,

      tipoPessoa: this.formPessoas.get('tipoPessoa')?.value,
      cpf: cpfDigits || null,          // <<<<<< garante string ou null
      cnpj: (docRaw.cnpj ?? '').toString().replace(/\D/g, '') || null,
      estadoCivil: docRaw.estadoCivil || this.formFisica.get('estadoCivil')?.value || null, // estadoCivil pode vir de ambos

      capitalNacional: this.toNumberOrNull(docRaw.capitalNacional),
      capitalEstrangeiro: this.toNumberOrNull(docRaw.capitalEstrangeiro),
      percentCapitalNacional: this.toNumberOrNull(docRaw.percentCapitalNacional),
      percentCapitalEstrangeiro: this.toNumberOrNull(docRaw.percentCapitalEstrangeiro),
      pcePercentCapital: this.toNumberOrNull(docRaw.pcePercentCapital),
    };

    const dados = {
      pessoa: {
        ...this.formPessoas.value,
        ...(this.tipoPessoaSelecionada() === 'FISICA'
          ? this.formFisica.value
          : this.formJuridica.value),
        // Inclua campos do anexo aqui SE eles pertencem à pessoa!
        // Exemplo:
        coordenadaEste: this.formAnexo.get('coordenadaEste')?.value,
        coordenadaNorte: this.formAnexo.get('coordenadaNorte')?.value,
        dataNascimento: this.formFisica.get('dataNascimento')?.value ?
          this.formFisica.get('dataNascimento')?.value.toISOString().slice(0, 10) : null,
        dataCasamento: this.formFisica.get('dataCasamento')?.value ?
          this.formFisica.get('dataCasamento')?.value.toISOString().slice(0, 10) : null,
        // Garantir que sexo seja enviado corretamente
        sexoPessoa: this.formFisica.get('sexoPessoa')?.value ?? null,
        atividadePrincipal: this.formAnexo.get('atividadePrincipal')?.value,
        isRecebePronaf: this.formAnexo.get('isRecebePronaf')?.value,
        qtdPronaf: this.formAnexo.get('qtdPronaf')?.value || null,
        valorTotalPronafs: this.formAnexo.get('valorTotalPronafs')?.value || null,
        recebeProgramaGoverno: this.formAnexo.get('recebeProgramaGoverno')?.value,
        isContratoPrazoIndeterminado: !!this.formPessoaLote.get('isContratoPrazoIndeterminado')?.value // força booleano
      },
      pessoaLote: pessoaLotePayload,
      endereco: this.formEnderecoPessoa.value,
      documento: nullifyEmptyStrings(documento)
    };
    console.log('Documento para salvar:', dados.documento);
    console.log('[Pessoas] 🔍 Debug salvamento:');
    console.log('[Pessoas] sexo do formFisica:', this.formFisica.get('sexoPessoa')?.value);
    console.log('[Pessoas] sexo na pessoa:', dados.pessoa.sexoPessoa);
    console.log('[Pessoas] estadoCivil do formFisica:', this.formFisica.get('estadoCivil')?.value);
    console.log('[Pessoas] estadoCivil do documento raw:', docRaw.estadoCivil);
    console.log('[Pessoas] estadoCivil no documento final:', dados.documento.estadoCivil);
    console.log('DADOS: ', dados)
    const dadosTratados = nullifyEmptyStrings(dados);
    console.log('DADOS TRATADOS: ', dadosTratados)
    console.log('loteId:', this.formPessoaLote.get('loteId')?.value);
    console.log('PessoaLote payload:', this.formPessoaLote.value);
    console.log('formDocumentoPessoa (raw):', this.formDocumentoPessoa.getRawValue());
    console.log('CPF enviado:', documento.cpf)
    // Salva pessoa
    this.pessoasService.salvarPessoa(dadosTratados).subscribe({
      next: (pessoaSalva) => {

        if (!pessoaSalva.id) {
          alert('Pessoa sem id, algo deu errado!');
          return;
        }
        this.snackBar.open('Pessoa salva com sucesso!', 'Fechar', { duration: 3000 });
        const loteId = this.formPessoas.get('loteId')?.value;
        if (loteId) {
          this.router.navigate(['/cadastro-endereco-lote'], { queryParams: { loteId } });
        }

        const condicao = this.formPessoaLote.get('condicaoPessoaImovelRural')?.value;
        let isContratoPrazoIndeterminado = this.formPessoaLote.get('isContratoPrazoIndeterminado')?.value;

        // Só é permitido marcar “Prazo Indeterminado” se for Comodatário
        if (condicao !== CondicaoPessoaImovel.Comodatario && condicao !== CondicaoPessoaImovel.Parceiro && condicao !== CondicaoPessoaImovel.Concessionario) {
          isContratoPrazoIndeterminado = false;
        }

        // Agora vincula pessoa e lote
        const pessoaLote: PessoaLoteDTO = {
          pessoaId: pessoaSalva.id!, // O id gerado pelo backend!
          loteId: this.formPessoaLote.get('loteId')?.value,
          // demais campos opcionais (pode usar outros dados do form)
          condicaoPessoaImovelRural: this.formPessoaLote.get('condicaoPessoaImovelRural')?.value,
          percentDetencao: this.formPessoaLote.get('percentDetencao')?.value,
          isDeclarante: this.formPessoaLote.get('isDeclarante')?.value,
          isResideNoImovel: this.formPessoaLote.get('isResideNoImovel')?.value,
          tipoDoAto: this.formPessoaLote.get('tipoDoAto')?.value,
          numeroAto: this.formPessoaLote.get('numeroAto')?.value,
          dataAto: this.formPessoaLote.get('dataAto')?.value,
          quantidadeAreaCedida: this.formPessoaLote.get('quantidadeAreaCedida')?.value,
          atividadePrincipalExploracao: this.formPessoaLote.get('atividadePrincipalExploracao')?.value,
          contrato: this.formPessoaLote.get('contrato')?.value,
          dataTerminoContrato: this.formPessoaLote.get('dataTerminoContrato')?.value,
          isContratoPrazoIndeterminado: isContratoPrazoIndeterminado ?? false
        };

        // Só adiciona o campo se for Comodatário (ajuste o valor exato do select se necessário)
        if (condicao && condicao.includes('Comodatário')) {
          pessoaLote.isContratoPrazoIndeterminado = this.formPessoaLote.get('isContratoPrazoIndeterminado')?.value;
        }

        this.pessoaLoteService.salvar(pessoaLote).subscribe({
          next: (pessoaLote) => {
            this.snackBar.open('Pessoa e vínculo salvos com sucesso!', 'Fechar', { duration: 3000 });
            
            // Se estava em modo adicionar nova, limpar formulários PRIMEIRO
            if (this.modoAdicionarNova) {
              this.limparTodosFormularios();
              this.modoAdicionarNova = false;
            }
            
            // Recarregar lista de pessoas vinculadas DEPOIS de limpar
            console.log('[Pessoas] 🔄 Recarregando pessoas após salvamento, loteId:', loteId);
            this.recarregarListaPessoas(loteId);
            
            this.cdr.markForCheck();
          },
          error: (err) => {
            this.snackBar.open('Erro ao salvar vínculo!', 'Fechar', { duration: 3000 });
            console.error('Erro salvar PessoaLote:', err);
          }
        });
        
        // Navegar para próxima página apenas se não estiver em modo adicionar nova
        if (!this.modoAdicionarNova) {
          this.router.navigate(['/cadastro-dados-sobre-uso'], { queryParams: { loteId } });
        }
      },
      error: (e) => {
        console.error('Erro ao salvar pessoa:', e);
        console.log('Status do erro:', e.status);
        console.log('Mensagem do erro:', e.error);
        console.log('Erro completo:', JSON.stringify(e, null, 2));
        
        // Verifica se é erro de CPF duplicado
        const errorMessage = e?.error?.message || e?.message || e?.error || '';
        console.log('Mensagem extraída:', errorMessage);
        
        const isCpfDuplicado = errorMessage.includes('duplicate key value violates unique constraint "un_cpf"') ||
                              errorMessage.includes('CPF') && errorMessage.includes('already exists') ||
                              errorMessage.includes('duplicate key') && errorMessage.includes('cpf') ||
                              errorMessage.includes('un_cpf') ||
                              (e.status === 400 && errorMessage.includes('duplicate'));
        
        console.log('É CPF duplicado?', isCpfDuplicado);
        
        if (isCpfDuplicado) {
          this.snackBar.open(
            '❌ CPF já cadastrado! Esta pessoa já existe no sistema. Use a busca para editá-la ou altere o CPF.',
            'Fechar',
            { duration: 8000 }
          );
          // Limpa apenas o campo CPF para permitir correção
          this.formDocumentoPessoa.get('cpf')?.setValue('');
          this.formDocumentoPessoa.get('cpf')?.markAsTouched();
          this.cdr.markForCheck();
        } else {
          this.snackBar.open(
            '❌ Erro ao salvar pessoa! Verifique os dados e tente novamente.',
            'Fechar',
            { duration: 6000 }
          );
        }
      }
    });
  }

  onAtualizar(): void {
    // helper local p/ datas (yyyy-MM-dd)
    const toISO = (v: any): string | null => {
      if (!v) return null;
      if (v instanceof Date) return v.toISOString().slice(0, 10);
      if (typeof v === 'object' && 'year' in v) {
        const { year, month, day } = v;
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      }
      if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
      return null;
    };

    // 1) validar lote e obter pessoaLoteId
    const loteId = this.formPessoaLote.get('loteId')?.value;
    if (!loteId) {
      this.snackBar.open('Lote não selecionado.', 'Fechar', { duration: 3000 });
      return;
    }

    // Validar se o nome foi preenchido
    const nome = this.formPessoas.get('nome')?.value;
    if (!nome || nome.trim() === '') {
      this.snackBar.open('Nome da pessoa é obrigatório!', 'Fechar', { duration: 3000 });
      this.formPessoas.get('nome')?.markAsTouched();
      return;
    }

    // Prossegue com a atualização
    this.executarAtualizacao(toISO);
  }

  private executarAtualizacao(toISO: (v: any) => string | null) {
    // 1) validar lote e obter pessoaLoteId
    const loteId = this.formPessoaLote.get('loteId')?.value;
    const pessoaLoteId =
      (this as any).pessoaLoteIdEmEdicao ??
      Number(this.route.snapshot.queryParamMap.get('pessoaLoteId'));
    
    console.log('[Pessoas] 🔍 Debug pessoaLoteId:');
    console.log('[Pessoas] 🔍 - pessoaLoteIdEmEdicao:', (this as any).pessoaLoteIdEmEdicao);
    console.log('[Pessoas] 🔍 - pessoaLoteId da query:', this.route.snapshot.queryParamMap.get('pessoaLoteId'));
    console.log('[Pessoas] 🔍 - pessoaLoteId final:', pessoaLoteId);
    
    if (!pessoaLoteId) {
      this.snackBar.open('pessoaLoteId não informado.', 'Fechar', { duration: 3500 });
      return;
    }

    // 2) pessoaLote (tratando datas e regra do prazo indeterminado)
    const pessoaLoteCamposData = ['dataAto', 'dataTerminoContrato'];
    const pessoaLotePayload = parseDateFields(this.formPessoaLote.getRawValue(), pessoaLoteCamposData);

    const condicao = this.formPessoaLote.get('condicaoPessoaImovelRural')?.value;
    let isPrazoInd = !!this.formPessoaLote.get('isContratoPrazoIndeterminado')?.value;
    if (condicao !== CondicaoPessoaImovel.Comodatario &&
      condicao !== CondicaoPessoaImovel.Parceiro &&
      condicao !== CondicaoPessoaImovel.Concessionario) {
      isPrazoInd = false;
    }
    pessoaLotePayload.isContratoPrazoIndeterminado = isPrazoInd;

    // 3) documento (sincroniza tipoPessoa + cpf/cnpj e normaliza números)
    const docRaw = this.formDocumentoPessoa.getRawValue();
    const toNumOrNull = (v: any) => (v === '' || v === null || v === undefined ? null : Number(v));
    const cpfDigits = (docRaw.cpf ?? '').toString().replace(/\D/g, ''); // só números
    
    // estadoCivil pode vir do formFisica ou formDocumentoPessoa
    const estadoCivilValue = docRaw.estadoCivil || this.formFisica.get('estadoCivil')?.value || null;
    
    const documento = {
      ...docRaw,
      tipoPessoa: this.formPessoas.get('tipoPessoa')?.value,
      cpf: cpfDigits || null,          // <<<<<< garante string ou null
      cnpj: (docRaw.cnpj ?? '').toString().replace(/\D/g, '') || null,
      estadoCivil: estadoCivilValue, // Garantir que estadoCivil seja enviado
      capitalNacional: toNumOrNull(docRaw.capitalNacional),
      capitalEstrangeiro: toNumOrNull(docRaw.capitalEstrangeiro),
      percentCapitalNacional: docRaw.percentCapitalNacional ?? null,   // backend espera string
      percentCapitalEstrangeiro: docRaw.percentCapitalEstrangeiro ?? null,
      pcePercentCapital: docRaw.pcePercentCapital ?? null,
      codigoPaisOrigem: this.onlyDigits(docRaw.codigoPaisOrigem) || docRaw.codigoPaisOrigem || null,
      codigoPaisResidencia: this.onlyDigits(docRaw.codigoPaisResidencia) || docRaw.codigoPaisResidencia || null,
    };
    
    console.log('[Pessoas] 🔍 Debug documento para atualização:');
    console.log('[Pessoas] estadoCivil do formFisica:', this.formFisica.get('estadoCivil')?.value);
    console.log('[Pessoas] estadoCivil do documento raw:', docRaw.estadoCivil);
    console.log('[Pessoas] estadoCivil final enviado:', documento.estadoCivil);
    
    console.log('[Pessoas] 🔍 Debug pessoa para atualização:');
    console.log('[Pessoas] sexo do formFisica:', this.formFisica.get('sexoPessoa')?.value);

    // 4) pessoa (PF/PJ + anexo + datas)
    const pessoa = {
      ...this.formPessoas.value,
      ...(this.tipoPessoaSelecionada() === 'FISICA' ? this.formFisica.value : this.formJuridica.value),
      // datas em yyyy-MM-dd
      dataNascimento: toISO(this.formFisica.get('dataNascimento')?.value),
      dataCasamento: toISO(this.formFisica.get('dataCasamento')?.value),
      // campos específicos para garantir envio correto
      sexoPessoa: this.formFisica.get('sexoPessoa')?.value ?? null, // Garantir que sexo seja enviado
      racaCor: this.formFisica.get('racaCor')?.value ?? null,
      regimeDeBens: this.formFisica.get('regimeBens')?.value ?? null,
      isEspolio: !!this.formFisica.get('isEspolio')?.value,
      // anexo
      coordenadaEste: this.formAnexo.get('coordenadaEste')?.value,
      coordenadaNorte: this.formAnexo.get('coordenadaNorte')?.value,
      atividadePrincipal: this.formAnexo.get('atividadePrincipal')?.value,
      isRecebePronaf: this.formAnexo.get('isRecebePronaf')?.value ?? false,
      qtdPronaf: this.formAnexo.get('qtdPronaf')?.value ?? null,
      valorTotalPronafs: this.formAnexo.get('valorTotalPronafs')?.value ?? null,
      isRecebeAjudoProgramaGoverno: this.formAnexo.get('recebeProgramaGoverno')?.value ?? false,
    };

    // 5) montar payload final e limpar strings vazias
    const dados = {
      pessoa,
      pessoaLote: pessoaLotePayload,
      endereco: this.formEnderecoPessoa.getRawValue(),
      documento: nullifyEmptyStrings(documento)
    };
    const payload = nullifyEmptyStrings(dados);

    console.log('[Pessoas] 🔍 PUT payload completo:', payload);
    console.log('[Pessoas] 🔍 CPF enviado:', documento.cpf);
    console.log('[Pessoas] 🔍 pessoaLoteId:', pessoaLoteId);
    console.log('[Pessoas] 🔍 loteId:', loteId);

    // 6) chamar API
    this.pessoasService.atualizarPessoa(pessoaLoteId, payload).subscribe({
      next: (resp) => {
        this.snackBar.open('Dados atualizados com sucesso!', 'Fechar', { duration: 3000 });
        this.atualizando = true; // continua em modo edição
        
        console.log('[Pessoas] 🔄 Aplicando dados atualizados:', resp);
        
        // Aplica todos os dados usando o método patchAll que já está otimizado
        this.patchAll(resp);
        
        // Recarregar lista de pessoas vinculadas apenas se não estivermos editando
        if (!this.atualizando) {
          this.carregarPessoasVinculadas(loteId);
        } else {
          console.log('[Pessoas] ℹ️ Editando pessoa - não recarregando lista para evitar sobrescrita');
        }
        
        // Força detecção de mudanças após todas as operações
        this.cdr.markForCheck();
        
        // Não redirecionar automaticamente - manter na mesma página para edição
        console.log('[Pessoas] ✅ Pessoa atualizada com sucesso - permanecendo na página de edição');
      },
      error: (err) => {
        console.error('Erro ao atualizar detentor:', err);
        console.log('Status do erro:', err.status);
        console.log('Mensagem do erro:', err.error);
        console.log('Erro completo:', JSON.stringify(err, null, 2));
        
        // Verifica se é erro de CPF duplicado
        const errorMessage = err?.error?.message || err?.message || err?.error || '';
        console.log('Mensagem extraída:', errorMessage);
        
        const isCpfDuplicado = errorMessage.includes('duplicate key value violates unique constraint "un_cpf"') ||
                              errorMessage.includes('CPF') && errorMessage.includes('already exists') ||
                              errorMessage.includes('duplicate key') && errorMessage.includes('cpf') ||
                              errorMessage.includes('un_cpf') ||
                              (err.status === 400 && errorMessage.includes('duplicate'));
        
        console.log('É CPF duplicado?', isCpfDuplicado);
        
        if (isCpfDuplicado) {
          this.snackBar.open('CPF já cadastrado no sistema! Verifique se esta pessoa já foi cadastrada anteriormente.', 'Fechar', { duration: 5000 });
          // Limpa apenas o campo CPF para permitir correção
          this.formDocumentoPessoa.get('cpf')?.setValue('');
          this.formDocumentoPessoa.get('cpf')?.markAsTouched();
        } else {
        this.snackBar.open('Erro ao atualizar detentor.', 'Fechar', { duration: 4000 });
        }
        
        this.cdr.markForCheck();
      }
    });
  }

  onDelete(): void {
    const id = this.formPessoas.get('id')?.value as number | null;
    if (!id) return;
    if (!confirm('Remover esta pessoa?')) return;

    this.pessoasService.excluirPessoa(id).subscribe({
      next: () => {
        this.snackBar.open('Pessoa removida.', 'Fechar', { duration: 3000 });
        this.formPessoas.reset({ loteId: this.formPessoas.get('loteId')?.value });
      },
      error: () => this.snackBar.open('Erro ao remover.', 'Fechar', { duration: 4000 }),
    });
  }

  onLimpar() {
    const loteId = this.formPessoaLote.get('loteId')?.value;

    this.formAnexo.reset();
    this.formPessoas.reset({ tipoPessoa: 'FISICA' });
    this.formFisica.reset();
    this.formJuridica.reset();
    this.formPessoaLote.reset();

    this.formPessoaLote.get('loteId')?.setValue(loteId); // ← mantém o lote selecionado
    this.tipoPessoaSelecionada.set('FISICA');
  }

  limparTodosFormularios(): void {
    const loteId = this.formPessoaLote.get('loteId')?.value;

    console.log('[Pessoas] 🧹 Limpando todos os formulários para nova pessoa');

    // Limpar todos os formulários
    this.formAnexo.reset();
    this.formPessoas.reset({ tipoPessoa: 'FISICA' });
    this.formFisica.reset();
    this.formJuridica.reset();
    this.formPessoaLote.reset();
    this.formEnderecoPessoa.reset();
    this.formDocumentoPessoa.reset();

    // Restaurar valores essenciais
    this.formPessoaLote.get('loteId')?.setValue(loteId);
    this.tipoPessoaSelecionada.set('FISICA');
    
    // Aplicar modo de pessoa física
    this.applyTipoPessoaMode('FISICA');

    console.log('[Pessoas] ✅ Todos os formulários limpos');
  }

  onTipoPessoaChange(value: string) {
    this.tipoPessoaSelecionada.set(value);
  }

  get condicaoSelecionada(): CondicaoPessoaImovel {
    return this.formPessoaLote.get('condicaoPessoaImovelRural')?.value;
  }

  isCondicaoBloco1(): boolean {
    return [
      CondicaoPessoaImovel.ProprietarioPosseiroIndividual,
      CondicaoPessoaImovel.ProprietarioPosseiroComum,
      CondicaoPessoaImovel.Usufrutario,
      CondicaoPessoaImovel.NuProprietario,
      CondicaoPessoaImovel.Arrendatario
    ].includes(this.condicaoSelecionada);
  }

  isCondicaoBloco2(): boolean {
    return [
      CondicaoPessoaImovel.Parceiro,
      CondicaoPessoaImovel.Comodatario,
      CondicaoPessoaImovel.Concessionario
    ].includes(this.condicaoSelecionada);
  }

  private verificarPessoaExistentePorCPF(cpf: string, loteId: number, proprietario: string) {
    console.log('[Pessoas] 🔍 Verificando se já existe pessoa com CPF:', cpf);
    
    // Busca pessoa existente através de todos os lotes para encontrar por CPF
    // Como não temos endpoint direto por CPF, vamos usar uma abordagem inteligente
    this.buscarPessoaPorCPF(cpf).then((pessoaExistente) => {
      if (pessoaExistente) {
        console.log('[Pessoas] ✅ Pessoa encontrada com este CPF:', pessoaExistente);
        console.log('[Pessoas] 🔄 Ativando modo ATUALIZAÇÃO automático');
        
        this.snackBar.open(
          '✅ Pessoa encontrada com este CPF. Ativando modo de edição automaticamente.',
          'Fechar',
          { duration: 5000 }
        );
        
        // Ativa modo de edição
        this.atualizando = true;
        this.patchAll(pessoaExistente);
        this.cdr.markForCheck();
      } else {
        console.log('[Pessoas] ℹ️ Nenhuma pessoa encontrada com este CPF - modo SALVAR');
        this.preencherDadosNovoDetentor({ cpf, proprietario });
      }
    }).catch((error) => {
      console.error('[Pessoas] Erro ao buscar pessoa por CPF:', error);
      // Em caso de erro, prossegue com pré-preenchimento normal
      this.preencherDadosNovoDetentor({ cpf, proprietario });
    });
  }

  private async buscarPessoaPorCPF(cpf: string): Promise<any> {
    console.log('[Pessoas] 🔍 Buscando pessoa por CPF:', cpf);
    
    try {
      // Estratégia otimizada: busca todos os lotes com este CPF
      const lotes = await this.loteService.obterTodos().toPromise();
      console.log('[Pessoas] 📋 Total de lotes encontrados:', lotes?.length);
      
      if (!lotes || lotes.length === 0) {
        return null;
      }

      // Filtra lotes que têm o CPF correspondente
      const lotesComCPF = lotes.filter(lote => lote.cpf === cpf && lote.id);
      console.log('[Pessoas] 🎯 Lotes encontrados com CPF', cpf, ':', lotesComCPF.length);

      if (lotesComCPF.length === 0) {
        console.log('[Pessoas] ℹ️ Nenhum lote encontrado com este CPF');
        return null;
      }

      // Para cada lote com o CPF, tenta buscar pessoa associada
      for (const lote of lotesComCPF) {
        console.log('[Pessoas] 🔍 Verificando lote ID:', lote.id);
        
        try {
          // Tenta buscar pessoa para este lote
          const pessoaData = await this.pessoasService.buscarParaEdicaoPorLote(lote.id!).toPromise();
          if (pessoaData) {
            console.log('[Pessoas] ✅ Pessoa encontrada para lote', lote.id, ':', pessoaData);
            return pessoaData;
          }
        } catch (err: any) {
          // 404 é normal - significa que não há pessoa para este lote ainda
          if (err?.status !== 404) {
            console.error('[Pessoas] Erro ao buscar pessoa para lote', lote.id, ':', err);
          } else {
            console.log('[Pessoas] 📝 Lote', lote.id, 'não tem pessoa cadastrada ainda (404)');
          }
        }
      }
      
      console.log('[Pessoas] 🔍 CPF existe em lotes, mas nenhuma pessoa cadastrada ainda');
      return null;
      
    } catch (error) {
      console.error('[Pessoas] Erro ao buscar lotes:', error);
      throw error;
    }
  }

  private preencherDadosNovoDetentor(lote: any) {
    console.log('[Pessoas] 🔄 Pré-preenchendo dados do lote:', {
      cpf: lote.cpf,
      proprietario: lote.proprietario
    });
    
    // Pré-preenche o CPF do lote no documento da pessoa (opcional - pode ser alterado)
    if (lote.cpf) {
      this.formDocumentoPessoa.patchValue({
        cpf: lote.cpf
      });
      console.log('[Pessoas] ✅ CPF pré-preenchido (pode ser alterado):', lote.cpf);
    }

    // Pré-preenche o nome do detentor com o proprietário do lote (opcional - pode ser alterado)
    if (lote.proprietario) {
      this.formPessoas.patchValue({
        nome: lote.proprietario
      });
      console.log('[Pessoas] ✅ Nome do detentor pré-preenchido (pode ser alterado):', lote.proprietario);
    }
    
    console.log('[Pessoas] ℹ️ Dados pré-preenchidos como sugestão - podem ser alterados livremente');
  }

  onVoltarClick(): void {
    // Lógica customizada antes de voltar
    const loteId = this.formPessoas.get('loteId')?.value;
    
    if (loteId) {
      // Navega para a página de estrutura (anterior na sequência)
      this.router.navigate(['/cadastro-estrutura'], { 
        queryParams: { loteId: loteId } 
      });
    } else {
      // Volta para a página anterior
      this.location.back();
    }
  }

  // Métodos para gerenciar pessoas vinculadas
  recarregarListaPessoas(loteId: number): void {
    // Força recarregamento da lista (usado após salvar nova pessoa ou remover)
    console.log('[Pessoas] 🔄 Forçando recarregamento da lista de pessoas');
    this.carregarPessoasVinculadas(loteId);
  }

  carregarPessoasVinculadas(loteId: number): void {
    // Validar se loteId é válido
    if (!loteId || loteId === null) {
      console.warn('[Pessoas] ⚠️ loteId inválido para carregar pessoas:', loteId);
      this.pessoasVinculadas = [];
      this.isLoadingPessoas = false;
      this.cdr.markForCheck();
      return;
    }

    this.isLoadingPessoas = true;
    console.log('[Pessoas] 🔄 Carregando pessoas para lote:', loteId);
    
    // Usar o endpoint obterTodos() e filtrar por loteId
    this.pessoaLoteService.obterTodos().pipe(
      finalize(() => {
        // Garante que o spinner seja desativado em qualquer cenário
        this.isLoadingPessoas = false;
        this.cdr.markForCheck();
        console.log('[Pessoas] ✅ Spinner desativado');
      })
    ).subscribe({
      next: (todasPessoasLote) => {
        // Filtrar pessoas vinculadas ao lote específico
        const pessoasFiltradas = todasPessoasLote.filter(pessoaLote => pessoaLote.loteId === loteId) || [];
        
        console.log('[Pessoas] Pessoas filtradas para lote', loteId, ':', pessoasFiltradas.length);
        console.log('[Pessoas] Estrutura dos dados:', pessoasFiltradas);
        
        // Debug: mostrar estrutura detalhada do primeiro item
        if (pessoasFiltradas.length > 0) {
          console.log('[Pessoas] 🔍 Debug - Primeira pessoa encontrada:');
          console.log('[Pessoas] 🔍 - ID:', pessoasFiltradas[0].id);
          console.log('[Pessoas] 🔍 - LoteId:', pessoasFiltradas[0].loteId);
          console.log('[Pessoas] 🔍 - Estrutura completa:', JSON.stringify(pessoasFiltradas[0], null, 2));
        }
        
        // Se não há pessoas vinculadas, apenas definir a lista vazia
        if (pessoasFiltradas.length === 0) {
          this.pessoasVinculadas = [];
          console.log('[Pessoas] ℹ️ Nenhuma pessoa encontrada para o lote');
          return;
        }
        
        // Buscar dados completos de cada pessoa
        this.buscarDadosCompletosPessoas(pessoasFiltradas);
      },
      error: (err) => {
        console.error('[Pessoas] Erro ao carregar pessoas vinculadas:', err);
        this.pessoasVinculadas = [];
        // isLoadingPessoas será definido como false pelo finalize
      }
    });
  }

  private buscarDadosCompletosPessoas(pessoasLote: any[]): void {
    // Buscar dados completos para cada pessoa usando o endpoint de edição
    const requests = pessoasLote.map(pessoaLote => {
      if (pessoaLote.id) {
        return this.pessoaLoteService.getEditarDetentor(pessoaLote.id).pipe(
          catchError((err: any) => {
            console.warn('[Pessoas] Erro ao buscar dados completos da pessoa', pessoaLote.id, ':', err);
            // Retornar dados básicos se não conseguir buscar completos
            return of({
              pessoaLote: pessoaLote,
              pessoa: { nome: 'Nome não disponível', cpf: 'CPF não disponível' },
              endereco: null,
              documento: null
            });
          })
        );
      } else {
        // Se não tem ID, retornar dados básicos
        return of({
          pessoaLote: pessoaLote,
          pessoa: { nome: 'Nome não disponível', cpf: 'CPF não disponível' },
          endereco: null,
          documento: null
        });
      }
    });

    // Executar todas as requisições em paralelo
    forkJoin(requests).pipe(
      finalize(() => {
        // Garante que o spinner seja desativado em qualquer cenário
        this.isLoadingPessoas = false;
        this.cdr.markForCheck();
        console.log('[Pessoas] ✅ Spinner desativado (dados completos)');
      })
    ).subscribe({
      next: (dadosCompletos: any[]) => {
        // Mapear os dados para o formato esperado
        this.pessoasVinculadas = dadosCompletos.map((dados: any) => ({
          id: dados.pessoaLote.id,
          loteId: dados.pessoaLote.loteId,
          condicaoPessoaImovelRural: dados.pessoaLote.condicaoPessoaImovelRural,
          isDeclarante: dados.pessoaLote.isDeclarante,
          isResideNoImovel: dados.pessoaLote.isResideNoImovel,
          pessoa: {
            nome: dados.pessoa?.nome || 'Nome não informado',
            cpf: dados.pessoa?.cpf || dados.documento?.cpf || 'CPF não informado'
          }
        }));
        
        console.log('[Pessoas] Pessoas com dados completos carregadas:', this.pessoasVinculadas);
        // isLoadingPessoas será definido como false pelo finalize
      },
      error: (err: any) => {
        console.error('[Pessoas] Erro ao buscar dados completos das pessoas:', err);
        // Em caso de erro, usar dados básicos
        this.pessoasVinculadas = pessoasLote.map(pessoaLote => ({
          id: pessoaLote.id,
          loteId: pessoaLote.loteId,
          condicaoPessoaImovelRural: pessoaLote.condicaoPessoaImovelRural,
          isDeclarante: pessoaLote.isDeclarante,
          isResideNoImovel: pessoaLote.isResideNoImovel,
          pessoa: {
            nome: 'Nome não disponível',
            cpf: 'CPF não disponível'
          }
        }));
        // isLoadingPessoas será definido como false pelo finalize
      }
    });
  }

  adicionarNovaPessoa(): void {
    this.modoAdicionarNova = true;
    this.atualizando = false;
    this.pessoaLoteIdEmEdicao = null;
    
    // Limpar TODOS os formulários para nova pessoa
    this.limparTodosFormularios();
    
    console.log('[Pessoas] Modo adicionar nova pessoa ativado');
    this.cdr.markForCheck();
  }

  editarPessoa(pessoaLote: any): void {
    console.log('[Pessoas] 🔄 Iniciando edição da pessoa:', pessoaLote);
    console.log('[Pessoas] 🔍 pessoaLote.id:', pessoaLote.id);
    console.log('[Pessoas] 🔍 pessoaLote.loteId:', pessoaLote.loteId);
    
    // Limpar formulários primeiro para evitar conflitos
    this.limparTodosFormularios();
    
    // Usar o endpoint de edição por pessoaLoteId se disponível, senão usar o por lote
    if (pessoaLote.id) {
      console.log('[Pessoas] 🔄 Buscando dados da pessoa por pessoaLoteId:', pessoaLote.id);
      this.pessoaLoteService.getEditarDetentor(pessoaLote.id).subscribe({
        next: (resp) => {
          console.log('[Pessoas] ✅ Dados da pessoa carregados com sucesso:', resp);
          
          // Executar dentro do NgZone para garantir detecção de mudanças
          this.ngZone.run(() => {
            this.atualizando = true;
            this.pessoaLoteIdEmEdicao = pessoaLote.id;
            this.modoAdicionarNova = false;
            
            // Aplicar dados com delay para garantir que os formulários estejam limpos
            setTimeout(() => {
              this.patchAll(resp);
              
              // Forçar múltiplas detecções de mudanças
              this.cdr.detectChanges();
              this.cdr.markForCheck();
              
              // Aguardar e forçar novamente
              setTimeout(() => {
                this.cdr.detectChanges();
                this.cdr.markForCheck();
                console.log('[Pessoas] ✅ Dados aplicados e UI atualizada');
              }, 100);
              
            }, 50);
          });
          
          this.snackBar.open('Pessoa carregada para edição', 'Fechar', { duration: 3000 });
          console.log('[Pessoas] ℹ️ Pessoa carregada para edição - mantendo dados específicos');
        },
        error: (err) => {
          console.error('[Pessoas] ❌ Erro ao carregar pessoa para edição por pessoaLoteId:', err);
          // Fallback: tentar buscar por lote
          this.buscarPessoaPorLoteFallback(pessoaLote);
        }
      });
    } else {
      console.log('[Pessoas] ⚠️ pessoaLote.id não encontrado, usando fallback');
      this.buscarPessoaPorLoteFallback(pessoaLote);
    }
  }

  private buscarPessoaPorLoteFallback(pessoaLote: any): void {
    this.pessoasService.buscarParaEdicaoPorLote(pessoaLote.loteId).subscribe({
      next: (resp) => {
        // Executar dentro do NgZone para garantir detecção de mudanças
        this.ngZone.run(() => {
          this.atualizando = true;
          this.pessoaLoteIdEmEdicao = pessoaLote.id;
          this.modoAdicionarNova = false;
          
          // Aplicar dados com delay para garantir que os formulários estejam limpos
          setTimeout(() => {
            this.patchAll(resp);
            
            // Forçar múltiplas detecções de mudanças
            this.cdr.detectChanges();
            this.cdr.markForCheck();
            
            // Aguardar e forçar novamente
            setTimeout(() => {
              this.cdr.detectChanges();
              this.cdr.markForCheck();
              console.log('[Pessoas] ✅ Dados aplicados e UI atualizada (fallback)');
            }, 100);
            
          }, 50);
        });
        
        this.snackBar.open('Pessoa carregada para edição', 'Fechar', { duration: 3000 });
        console.log('[Pessoas] ℹ️ Pessoa carregada para edição (fallback) - mantendo dados específicos');
      },
      error: (err) => {
        console.error('[Pessoas] Erro ao carregar pessoa para edição:', err);
        this.snackBar.open('Erro ao carregar dados da pessoa', 'Fechar', { duration: 3000 });
      }
    });
  }

  removerPessoa(pessoaLote: any): void {
    const nomePessoa = this.getNomePessoa(pessoaLote);
    if (!confirm(`Tem certeza que deseja remover ${nomePessoa} do lote?`)) {
      return;
    }

    this.pessoaLoteService.excluir(pessoaLote.id).subscribe({
      next: () => {
        this.snackBar.open('Pessoa removida do lote com sucesso!', 'Fechar', { duration: 3000 });
        
        // Recarregar lista de pessoas
        const loteId = this.formPessoaLote.get('loteId')?.value;
        if (loteId) {
          this.recarregarListaPessoas(loteId);
        }
        
        // Se estava editando esta pessoa, limpar formulários
        if (this.pessoaLoteIdEmEdicao === pessoaLote.id) {
          this.onLimpar();
          this.atualizando = false;
          this.pessoaLoteIdEmEdicao = null;
        }
        
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('[Pessoas] Erro ao remover pessoa:', err);
        this.snackBar.open('Erro ao remover pessoa do lote', 'Fechar', { duration: 3000 });
      }
    });
  }

  cancelarAdicao(): void {
    this.modoAdicionarNova = false;
    this.limparTodosFormularios();
    this.cdr.markForCheck();
  }

  trackByPessoaLoteId(index: number, pessoaLote: any): any {
    return pessoaLote.id || index;
  }

  getNomePessoa(pessoaLote: any): string {
    // Tenta diferentes caminhos para encontrar o nome
    return pessoaLote.pessoa?.nome || 
           pessoaLote.nome || 
           pessoaLote.pessoaNome || 
           'Nome não informado';
  }

  getCpfPessoa(pessoaLote: any): string {
    // Tenta diferentes caminhos para encontrar o CPF
    return pessoaLote.pessoa?.cpf || 
           pessoaLote.cpf || 
           pessoaLote.pessoaCpf || 
           'Não informado';
  }
}

export function nullifyEmptyStrings(obj: any): any {
  if (obj === '') return null;
  if (Array.isArray(obj)) {
    return obj.map(nullifyEmptyStrings);
  }
  if (obj !== null && typeof obj === 'object') {
    // Cria um novo objeto, evitando recursão infinita
    const copy: any = {};
    for (const key of Object.keys(obj)) {
      copy[key] = nullifyEmptyStrings(obj[key]);
    }
    return copy;
  }
  return obj;
}


function parseDateFields(obj: any, campos: string[]): any {
  const clone = { ...obj };
  campos.forEach(campo => {
    if (clone[campo] instanceof Date) {
      // Se vier um Date
      clone[campo] = clone[campo].toISOString().split('T')[0];
    } else if (clone[campo] && typeof clone[campo] === 'object' && 'year' in clone[campo]) {
      // Se vier um objeto do tipo { year, month, day }
      const { year, month, day } = clone[campo];
      // Padroniza mês/dia pra dois dígitos
      clone[campo] = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    } else if (typeof clone[campo] !== 'string') {
      // Qualquer outro tipo estranho vira null
      clone[campo] = null;
    }
  });
  return clone;
}


