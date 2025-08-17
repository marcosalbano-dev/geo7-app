import { ChangeDetectionStrategy, Component, Input, OnInit, signal } from '@angular/core';
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
import { CondicaoPessoaImovel } from '../enums/enum-condicao-pessoa-imovel.enum';
import { CadastroPessoasAnexoComponent } from '../cadastro-pessoas-anexo/cadastro-pessoas-anexo.component';
import { CadastroDocumentoPessoaComponent } from '../cadastro-documento-pessoa/cadastro-documento-pessoa.component';
import { PessoasService } from '../services/pessoa.service';
import { Municipio } from '../models/municipio';
import { EstadoService } from '../services/estado.service';
import { MunicipioService } from '../services/municipio.service';
import { ErrorStateMatcher, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CadastroPessoaLoteComponent } from '../cadastro-pessoa-lote/cadastro-pessoa-lote.component';
import { ActivatedRoute, Router } from '@angular/router';
import { LoteService } from '../services/lote.service';
import { PessoaLoteDTO } from '../models/pessoa-lote.dto';
import { PessoaLoteService } from '../services/pessoa-lote.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { toggleControls } from '../helpers/documentos-pessoa-mapper';
import { CadastroEnderecoPessoaComponent } from "../cadastro-endereco-pessoa/cadastro-endereco-pessoa.component";
import { EditarDetentorResponseDTO } from '../models/editar-detentor-response-dto';
import { ChangeDetectorRef } from '@angular/core';

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
    MatDatepickerModule,
    MatNativeDateModule,
    CadastroPessoaLoteComponent,
    CadastroEnderecoPessoaComponent,
    CadastroDocumentoPessoaComponent
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
    { value: 'masculino', viewValue: 'Masculino' },
    { value: 'feminino', viewValue: 'Feminino' },
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

  atividades = [
    { value: 'agricola', viewValue: '1 - Agrícola' },
    { value: 'pecuaria', viewValue: '3 - Pecuária' },
    { value: 'granjeira', viewValue: '5 - Granjeira' }
  ];

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

  tipoPessoaSelecionada = signal<string>('FISICA');

  formPessoas: FormGroup;
  formFisica: FormGroup;
  formJuridica: FormGroup;
  formPessoaLote: FormGroup;
  formAnexo: FormGroup;
  formEnderecoPessoa: FormGroup;
  formDocumentoPessoa: FormGroup;

  constructor(
    private fb: FormBuilder,
    private pessoasService: PessoasService,
    private loteService: LoteService,
    private municipioService: MunicipioService,
    private route: ActivatedRoute,
    private pessoaLoteService: PessoaLoteService,
    private snackBar: MatSnackBar,
    private router: Router,
    private cdr: ChangeDetectorRef
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
      nome: [''],
      numero: [''],
      complemento: [''],
      bairro: [''],
      //municipioResidencia: [''],
      uf: [''],
      cep: [''],
      telefone: [''],
      email: [''],
      tipoPessoa: [this.tipoPessoaSelecionada()]
    });

    this.formFisica = this.fb.group({
      //cpf: [''],
      dataNascimento: [''],
      sexoPessoa: [''],
      isEspolio: [false],
      racaCor: [''],
      estadoCivil: [''],
      dataCasamento: [''],
      regimeBens: [''],
      tipoDocumento: [''],
      numeroDocumento: [''],
      orgaoEmissor: [''],
      ufOrgaoEmissor: [''],
      tipoNacionalidade: [''],
      ufNaturalidade: [''],
      naturalidadeId: [''],
      codigoPaisOrigem: [''],
      codigoPaisResidencia: [''],
      nomePai: [''],
      nomeMae: [''],
    });

    this.formJuridica = this.fb.group({
      cnpj: [''],
      naturezaJuridica: [''],
      tipoPoder: [''],
      tipoGoverno: [''],
      ufPaisSede: [''],
      codigoPaisSede: [''],
      capitalNacional: [''],
      capitalEstrangeiro: [''],
      registroJuntaComercial: [''],
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
      codigoPaisResidencia: ['931'],
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
      codigoPaisResidencia: [''],

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
        this.loteService.obterPorId(loteId).subscribe(l => this.numero = l.numero);
    
        this.pessoasService.buscarParaEdicaoPorLote(loteId).subscribe({
          next: (resp) => this.patchAll(resp),
          error: (err) => {
            // sem vínculo => permanece em modo "Salvar"
            if (err.status !== 404) console.error('Erro ao carregar edição por lote', err);
            this.atualizando = false;
            this.cdr.markForCheck();
          }
        });
      });
      ['cpf','cnpj','estadoCivil','tipoNacionalidade','ufNaturalidade','naturalidadeId','codigoPaisOrigem','codigoPaisResidencia']
      .forEach(k => {
        if (!this.formDocumentoPessoa.get(k)) {
          this.formDocumentoPessoa.addControl(k, new FormControl(''));
        }
      });
  }

  private patchAll(resp: EditarDetentorResponseDTO) {
    // Pessoa básica
    if (resp.pessoa) {
      this.formPessoas.patchValue({
        nome: resp.pessoa.nome ?? '',
        telefone: resp.pessoa.telefone ?? '',
        email: resp.pessoa.email ?? ''
      }, { emitEvent: false });
  
      const toDate = (s?: string|null) => s ? new Date(s) : null;
  
      this.formFisica.patchValue({
        dataNascimento: toDate(resp.pessoa.dataNascimento as any),
        sexoPessoa: resp.pessoa.sexoPessoa ?? null,
        isEspolio: !!resp.pessoa.isEspolio,
        racaCor: resp.pessoa.racaCor ?? null,
        dataCasamento: resp.pessoa.dataCasamento ?? null,
        regimeBens: resp.pessoa.regimeDeBens ?? null,
        nomePai: resp.pessoa.nomePai ?? null,
        nomeMae: resp.pessoa.nomeMae ?? null,
      }, { emitEvent: false });
  
      // Anexo (vem na própria pessoa)
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
  
    // Documento
    if (resp.documento) {
      this.formDocumentoPessoa.patchValue(resp.documento, { emitEvent: false });
      const tp = resp.documento.tipoPessoa || 'FISICA';
      this.formPessoas.get('tipoPessoa')?.setValue(tp, { emitEvent: false });
      this.applyTipoPessoaMode(tp);
    }
  
    // Endereço
    if (resp.endereco) {
      this.formEnderecoPessoa.patchValue({
        logradouro: resp.endereco.logradouro ?? '',
        complemento: resp.endereco.complemento ?? '',
        numero: resp.endereco.numero ?? '',
        bairro: resp.endereco.bairro ?? '',
        cep: resp.endereco.cep ?? '',
        codigoPaisResidencia: resp.endereco.codigoPaisResidencia ?? '931',
        municipioId: resp.endereco.municipioId ?? null,
        uf: resp.endereco.uf ?? ''
      }, { emitEvent: false });
    }

    // carrega municípios da UF e só então aplica o municipioId
  if (resp.endereco.uf) {
    this.onUfChange(resp.endereco.uf);
    setTimeout(() => {
      this.formEnderecoPessoa.patchValue({ municipioId: resp.endereco.municipioId }, { emitEvent: false });
    });
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
    this.cdr.markForCheck();
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

  onUfChange(uf: string): void {
    this.isLoadingMunicipio = true;
    this.municipioService.getMunicipiosPorUf(uf).subscribe({
      next: (municipios) => {
        this.municipios = municipios;
        this.formPessoas.get('municipioResidencia')?.setValue(null);
        this.isLoadingMunicipio = false;
      },
      error: () => {
        this.municipios = [];
        this.isLoadingMunicipio = false;
      }
    });
  }

  toNumberOrNull(v: any) {
    if (v === null || v === undefined || v === '') return null;
    const n = Number(v);
    return isNaN(n) ? null : n;
  }


  onSalvar() {
    console.log('formPessoas:', this.formPessoas.value);
    // (garanta que o valor está presente no formPessoaLote)
    if (!this.formPessoaLote.get('loteId')?.value) {
      alert('Lote não selecionado!');
      return;
    }
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
      codigoPaisOrigem: docRaw.codPaisOrigem ?? docRaw.codigoPaisOrigem ?? null,
      codigoPaisResidencia: docRaw.codigoPaisResidencia ?? docRaw.codPaisResidencia ?? null,

      naturezaJuridica: docRaw.naturezaJuridica ?? this.formJuridica.get('naturezaJuridica')?.value ?? null,
      registroJuntaComercial: docRaw.registroJuntaComercial ?? this.formJuridica.get('regJuntaComercial')?.value ?? null,

      tipoPessoa: this.formPessoas.get('tipoPessoa')?.value,
      cpf: cpfDigits || null,          // <<<<<< garante string ou null
      cnpj: (docRaw.cnpj ?? '').toString().replace(/\D/g, '') || null,

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
            alert('Pessoa e vínculo salvos com sucesso!');
          },
          error: (err) => {
            alert('Erro ao salvar vínculo!');
            console.error('Erro salvar PessoaLote:', err);
          }
        });
        alert('Pessoa vinculada com sucesso ao lote!');
        this.onLimpar(); // ← limpa os dados para novo cadastro
      },
      error: (e) => {
        alert('Erro ao salvar pessoa!');
        console.error(e);
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
    const pessoaLoteId =
      (this as any).pessoaLoteIdEmEdicao ??
      Number(this.route.snapshot.queryParamMap.get('pessoaLoteId'));
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
    const documento = {
      ...docRaw,
      tipoPessoa: this.formPessoas.get('tipoPessoa')?.value,
      cpf: cpfDigits || null,          // <<<<<< garante string ou null
      cnpj: (docRaw.cnpj ?? '').toString().replace(/\D/g, '') || null,
      capitalNacional: toNumOrNull(docRaw.capitalNacional),
      capitalEstrangeiro: toNumOrNull(docRaw.capitalEstrangeiro),
      percentCapitalNacional: docRaw.percentCapitalNacional ?? null,   // backend espera string
      percentCapitalEstrangeiro: docRaw.percentCapitalEstrangeiro ?? null,
      pcePercentCapital: docRaw.pcePercentCapital ?? null
    };

    // 4) pessoa (PF/PJ + anexo + datas)
    const pessoa = {
      ...this.formPessoas.value,
      ...(this.tipoPessoaSelecionada() === 'FISICA' ? this.formFisica.value : this.formJuridica.value),
      // datas em yyyy-MM-dd
      dataNascimento: toISO(this.formFisica.get('dataNascimento')?.value),
      dataCasamento: toISO(this.formFisica.get('dataCasamento')?.value),

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

    console.log('PUT payload:', payload);
    console.log('CPF enviado:', documento.cpf)

    // 6) chamar API
    this.pessoasService.atualizarPessoa(pessoaLoteId, payload).subscribe({
      next: (resp) => {
        this.snackBar.open('Dados atualizados com sucesso!', 'Fechar', { duration: 3000 });
        this.atualizando = true; // continua em modo edição
        // 1) Pessoa (campos básicos)
        this.patchAll(resp);

        // 2) Pessoa Física (campos de PF que vêm na pessoa)
        const toDate = (s?: string | null) => (s ? new Date(s) : null);
        this.formFisica.patchValue({
          dataNascimento: toDate(resp.pessoa?.dataNascimento),
          sexoPessoa: resp.pessoa?.sexoPessoa ?? null,
          isEspolio: resp.pessoa?.isEspolio ?? false,
          racaCor: resp.pessoa?.racaCor ?? null,
          dataCasamento: resp.pessoa?.dataCasamento ?? null,
          regimeBens: resp.pessoa?.regimeDeBens ?? null,
          nomePai: resp.pessoa?.nomePai ?? null,
          nomeMae: resp.pessoa?.nomeMae ?? null,
        }, { emitEvent: false });

        // 3) Documento
        if (resp.documento) {
          this.formDocumentoPessoa.patchValue(resp.documento);
          const tp = resp.documento.tipoPessoa || 'FISICA';
          this.formPessoas.get('tipoPessoa')?.setValue(tp, { emitEvent: false });
          this.applyTipoPessoaMode(tp); // garante que o UI PF/PJ está coerente
        }

        // 4) Endereço
        if (resp.endereco) this.formEnderecoPessoa.patchValue(resp.endereco);

        // 5) Vínculo pessoa-lote
        if (resp.pessoaLote) this.formPessoaLote.patchValue(resp.pessoaLote);

        // navegação opcional:
        // this.router.navigate(['/cadastro-endereco-lote'], { queryParams: { loteId } });
      },
      error: (err) => {
        console.error('Erro ao atualizar detentor:', err);
        this.snackBar.open('Erro ao atualizar detentor.', 'Fechar', { duration: 4000 });
      }
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


