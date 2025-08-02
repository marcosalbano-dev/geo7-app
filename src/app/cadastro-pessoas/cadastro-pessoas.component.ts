import { ChangeDetectionStrategy, Component, Input, OnInit, signal } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CondicaoPessoaImovel } from '../enums/enum-condicao-pessoa-imovel.enum';
import { CadastroPessoasAnexoComponent } from '../cadastro-pessoas-anexo/cadastro-pessoas-anexo.component';
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
import {
  pessoaDtoToFormPessoas,
  pessoaDtoToFormFisica,
  pessoaDtoToFormJuridica,
  pessoaDtoToFormPessoaLote,
  mapFormToPessoaDTO
} from '../helpers/pessoa-mapper';
//import { ProgramaGovernoDTO } from '../models/programa-governo-dto';
//import { ProgramaGovernoService } from '../services/programa-governo.service';

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
    CadastroPessoaLoteComponent
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
    { value: 'executivo', viewValue: 'E - Executivo' },
    { value: 'legislativo', viewValue: 'L - Legislativo' },
    { value: 'judiciario', viewValue: 'J - Judiciário' }
  ];

  tiposGovernos = [
    { value: 'executivo', viewValue: 'E - Executivo' },
    { value: 'legislativo', viewValue: 'L - Legislativo' },
    { value: 'judiciario', viewValue: 'J - Judiciário' }
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
  formEndereco: FormGroup;
  formDocumento: FormGroup;

  constructor(
    private fb: FormBuilder,
    private pessoasService: PessoasService,
    private loteService: LoteService,
    private municipioService: MunicipioService,
    private route: ActivatedRoute,
    private pessoaLoteService: PessoaLoteService,
    private snackBar: MatSnackBar,
    private router: Router,
    //private programaGovernoService: ProgramaGovernoService
  ) {

    this.formAnexo = this.fb.group({
      utmEste: [''],
      utmNorte: [''],
      atividadePrincipal: [''],
      recebePronaf: [false],
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
      cpf: [''],
      nascimento: [''],
      sexo: [''],
      espolio: [''],
      raca: [''],
      estadoCivil: [''],
      casamento: [''],
      regimeBens: [''],
      tipoDocumento: [''],
      numeroDocumento: [''],
      orgaoEmissor: [''],
      ufOrgaoEmissor: [''],
      nacionalidade: [''],
      ufNaturalidade: [''],
      municipioNaturalidade: [''],
      codPaisOrigem: [''],
      codPaisResidencia: [''],
      nomePai: [''],
      nomeMae: [''],
    });

    this.formJuridica = this.fb.group({
      cnpj: [''],
      natureza: [''],
      tipoPoder: [''],
      tipoGoverno: [''],
      ufPaisSede: [''],
      codPaisSede: [''],
      capitalNacional: [''],
      capitalEstrangeiro: [''],
      regJuntaComercial: [''],
    });

    this.formPessoaLote = this.fb.group({
      loteId: [null, Validators.required],
      numero: [{ value: '', disabled: true }],
      condicaoPessoaImovelRural: [''],
      detencao: [null],
      isDeclarante: [false],
      isResideNoImovel: [false],
      atividadePrincipalExploracao: [null],
      qtdAreaCedida: [null],
      terminoContrato: [null],
      tipoContrato: [null],
      tiposAtos: [null],
      numeroAto: [null],
      dataAto: [null],
      prazoIndeterminado: [null],
      dataTerminoContrato: ['']
    });

    this.formEndereco = this.fb.group({
      logradouro: [''],
      complemento: [''],
      numero: [''],
      bairro: [''],
      cep: [''],
      codigoPaisResidencia: ['931'],
      municipioId: [null],
      uf: ['']
    });

    this.formDocumento = this.fb.group({
      id: [null],
      tipoDocumentoIdentificacao: [''],
      numeroDocumentoIdentificacao: [''],
      orgaoEmissor: [''],
      ufOrgaoEmissor: [''],
      tipoNacionalidade: [''],
      cpf: [''],
      cnpj: [''],
      estadoCivil: [''],
      tipoPessoa: [''],
      naturezaJuridica: [''],
      capitalNacional: [''],
      capitalEstrangeiro: [''],
      registroJuntaComercial: [''],
      nomeFantasia: [''],
      codigoPaisSede: [''],
      ufPaisSede: [''],
      tipoDocumentoRepresentanteLegal: [''],
      numeroDocumentoRepresentanteLegal: [''],
      tipoDePoder: [''],
      tipoDeGoverno: [''],
      percentCapitalNacional: [''],
      percentCapitalEstrangeiro: [''],
      pcePais: [''],
      pcePercentCapital: [''],
      obsevacoesQuadro7: ['']
    });

    // Atualiza signal quando troca tipo
    this.formPessoas.get('tipoPessoa')?.valueChanges.subscribe(tp => {
      this.tipoPessoaSelecionada.set(tp);
    });
  }

  ngOnInit(): void {
    this.loadUfs();
    // this.programaGovernoService.getAll().subscribe({
    //   next: (dados) => this.programas = dados,
    //   error: () => this.programas = []
    // });

    const loteId = Number(this.route.snapshot.queryParamMap.get('id'));

    this.route.queryParams.subscribe(params => {
      const loteId = params['loteId'];
      this.formPessoaLote.get('loteId')?.setValue(loteId);
      const pessoaLoteId = params['pessoaLoteId']; // depende da sua rota

      if (loteId) {
        this.formPessoaLote.get('loteId')?.setValue(+loteId);
        console.log('👥 LoteId recebido para cadastro de pessoas:', loteId);
        this.loteService.obterPorId(loteId).subscribe(lote => {
          this.numero = lote.numero; // <-- só preenche a variável
        });
      }
      if (pessoaLoteId) {
        this.pessoaLoteService.getEditarDetentor(pessoaLoteId).subscribe(data => {
          this.formPessoas.patchValue(data.pessoa);
          this.formPessoaLote.patchValue(data.pessoaLote);
          this.formEndereco.patchValue(data.endereco);
          this.formDocumento.patchValue(data.documento);
        });
      }
    });

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
    
    const dados = {
      pessoa: {
        ...this.formPessoas.value,
        ...(this.tipoPessoaSelecionada() === 'FISICA'
          ? this.formFisica.value
          : this.formJuridica.value),
        // Inclua campos do anexo aqui SE eles pertencem à pessoa!
        // Exemplo:
        nacimento: this.formFisica.get('nascimento')?.value ? 
          this.formFisica.get('nascimento')?.value.toISOString().slice(0, 10) : null,
        atividadePrincipal: this.formAnexo.get('atividadePrincipal')?.value,
        recebePronaf: this.formAnexo.get('recebePronaf')?.value,
        qtdPronaf: this.formAnexo.get('qtdPronaf')?.value || null,
        valorTotalPronafs: this.formAnexo.get('valorTotalPronafs')?.value || null,
        recebeProgramaGoverno: this.formAnexo.get('recebeProgramaGoverno')?.value,
        //programasDoGovernoIds: this.formAnexo.value.programasSelecionados
      },
      pessoaLote: pessoaLotePayload,
      endereco: this.formEndereco.value,
      documento: this.formDocumento.value
    };
    console.log('DADOS: ', dados)
    const dadosTratados = nullifyEmptyStrings(dados);
    console.log('DADOS TRATADOS: ', dadosTratados)
    //...this.formPessoaLote.value
    //console.log('Dados para salvar:', dados);
    console.log('loteId:', this.formPessoaLote.get('loteId')?.value);
    console.log('PessoaLote payload:', this.formPessoaLote.value);
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
        if (condicao !== CondicaoPessoaImovel.Comodatario || condicao !== CondicaoPessoaImovel.Parceiro || condicao !== CondicaoPessoaImovel.Concessionario) {
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


