import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
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
import { ActivatedRoute } from '@angular/router';


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
export class CadastroPessoasComponent {



  errorStateMatcher: ErrorStateMatcher = {
    isErrorState: (control) => !!(control && control.invalid && control.touched),
  };


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

  tipoPessoaSelecionada = signal<string>('FISICA');

  formPessoas: FormGroup;
  formFisica: FormGroup;
  formJuridica: FormGroup;
  formPessoaLote: FormGroup;
  formAnexo: FormGroup;

  constructor(
    private fb: FormBuilder,
    private pessoasService: PessoasService,
    private estadoService: EstadoService,
    private municipioService: MunicipioService,
    private route: ActivatedRoute) {

    this.formAnexo = this.fb.group({
      utmEste: [''],
      utmNorte: [''],
      atividadePrincipal: [''],
      recebePronaf: [false],
      qtdPronaf: [0],
      tiposPronaf: [[]],
      valorTotalPronafs: [''],
      recebeProgramaGoverno: [false],
      programasSelecionados: [[]],
    });

    this.formPessoas = this.fb.group({
      municipioId: [null, Validators.required],
      nome: [''],
      endereco: [''],
      numero: [''],
      complemento: [''],
      bairro: [''],
      municipioResidencia: [''],
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
      condicaoPessoaImovelRural: [''],
      detencao: [null],
      isDeclarante: [false],
      isResideNoImovel: [false],
      atividadePrincipal: [null],
      qtdAreaCedida: [null],
      terminoContrato: [null],
      tipoContrato: [null],
      tiposAtos: [null],
      numeroAto: [null],
      dataAto: [null],
      prazoIndeterminado: [null],
      dataTerminoContrato: ['']
    });

    // Atualiza signal quando troca tipo
    this.formPessoas.get('tipoPessoa')?.valueChanges.subscribe(tp => {
      this.tipoPessoaSelecionada.set(tp);
    });
  }

  ngOnInit(): void {
    this.loadUfs();

    this.route.queryParams.subscribe(params => {
      const loteId = params['loteId'];
      if (loteId) {
        this.formPessoaLote.get('loteId')?.setValue(loteId);
        // se quiser atualizar o input, pode também:
        this.loteId = loteId;
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
    // (garanta que o valor está presente no formPessoaLote)
    if (!this.formPessoaLote.get('loteId')?.value) {
      alert('Lote não selecionado!');
      return;
    }
    // Aqui você já tem todos os valores dos forms
    const dados = {
      ...this.formAnexo.value,
      ...this.formPessoas.value,
      ...(this.tipoPessoaSelecionada() === 'FISICA'
        ? this.formFisica.value
        : this.formJuridica.value),
      ...this.formPessoaLote.value
    };
    console.log('Dados para salvar:', dados);

    console.log('formPessoaLote:', this.formPessoaLote.value);
    console.log('loteId:', this.formPessoaLote.get('loteId')?.value);

    this.pessoasService.salvarPessoa(dados).subscribe({
      next: (resp) => {
        alert('Salvo com sucesso!');
        // Pode resetar ou navegar
      },
      error: (e) => {
        alert('Erro ao salvar!');
        console.error(e);
      }
    });
  }


  onLimpar() {
    this.formAnexo.reset();
    this.formPessoas.reset({ tipoPessoa: 'FISICA' });
    this.formFisica.reset();
    this.formJuridica.reset();
    this.formPessoaLote.reset();
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
