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
import { Estrutura } from '../models/estrutura';
import { LoteDTO } from '../models/lote-dto';
import { EnderecoLote } from '../models/endereco-lote';
import { Municipio } from '../models/municipio';
import { MunicipioService } from '../services/municipio.service';
import { EstruturaService } from '../services/estrutura.service';
import { DistritoService } from '../services/distrito.service';
import { LoteService } from '../services/lote.service';
import { Distrito } from '../models/distrito';
import { NgFor } from '@angular/common'
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { EstruturaDTO } from '../models/estrutura-dto';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    CommonModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cadastro-estrutura.component.html',
  styleUrl: './cadastro-estrutura.component.scss'
})
export class CadastroEstruturaComponent implements OnInit {

  formEstrutura!: FormGroup;
  lotes: LoteDTO[] = [];
  municipios: Municipio[] = [];
  filteredDistritos: Distrito[] = [];
  isLoadingDistrito = false;
  isLoadingMunicipio = false;



  constructor(
    private fb: FormBuilder,
    private loteService: LoteService,
    private municipioService: MunicipioService,
    private distritoService: DistritoService,
    private estruturaService: EstruturaService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.inicializarFormulario();
    this.carregarLotes();
    this.carregarMunicipios();

    this.formEstrutura = this.fb.group({
      loteId: [null],
      numero: ['', Validators.required],
      sncr: [''],
      area: ['', Validators.required],
      denominacaoImovel: [''],
      municipioId: [null, Validators.required],
      distritoId: [null, Validators.required],
      codImoReceita: [''],
      comunidade: [''],
      localidade: [''],
      pontoReferencia: [''],
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
      numeroHerdeiros: [0],
      porcentagemDetencao: [0],
      obsLitigio: [''],
      entregouMemorialPlanilha: [''],
      isIrrigacao: [''],
      isFonteAguaExterna: [''],
      isRedeDeAbastecimento: [''],
      isAcude: [''],
      isAcudePerene: [''],
      isLagoa: [''],
      isLagoaPerene: [''],
      isPoco: [''],
      isPocoPerene: [''],
      isRioOuRiacho: [''],
      isRioOuRiachoPerene: [''],
      isOlhoDagua: [''],
      isOlhoDaguaPerene: [''],
      isPossuiEnergiaAlternativa: [''],
      tipoEnergiaEletrica: [null],
      usoDaguaAcude: [null],
      usoDaguaLagoa: [null],
      usoDaguaPoco: [null],
      usoDaguaRioOuRiacho: [null],
      usoDaguaOlhoDagua: [null],
      destinacaoDoImovel: [null],
      litigio: [null]
    });
  }

  private prepararEstruturaDTO(formValue: any): any {
    function toBoolean(value: any): boolean {
      return value === 'sim';
    }

    return {
      loteId: formValue.loteId,
      numero: formValue.numero,
      sncr: formValue.sncr,
      area: formValue.area,
      denominacaoImovel: formValue.denominacaoImovel,
      municipioId: formValue.municipioId,
      distritoId: formValue.distritoId,
      codImoReceita: formValue.codImoReceita,
      comunidade: formValue.comunidade,
      localidade: formValue.localidade,
      pontoReferencia: formValue.pontoReferencia,
      familiasResidentes: formValue.familiasResidentes,
      pessoasResidentes: formValue.pessoasResidentes,
      trabalhadoresComCarteira: formValue.trabalhadoresComCarteira,
      trabalhadoresSemCarteira: formValue.trabalhadoresSemCarteira,
      maoDeObraFamiliar: formValue.maoDeObraFamiliar,
      valorTotal: formValue.valorTotal,
      valorDasBenfeitorias: formValue.valorDasBenfeitorias,
      valorOutrasAtividades: formValue.valorOutrasAtividades,
      valorTerraNua: formValue.valorTerraNua,
      areaIrrigada: formValue.areaIrrigada,
      numeroHerdeiros: formValue.numeroHerdeiros,
      porcentagemDetencao: formValue.porcentagemDetencao,
      obsLitigio: formValue.obsLitigio,
      entregouMemorialPlanilha: toBoolean(formValue.entregouMemorialPlanilha),
      isIrrigacao: toBoolean(formValue.isIrrigacao),
      isFonteAguaExterna: toBoolean(formValue.isFonteAguaExterna),
      isRedeDeAbastecimento: toBoolean(formValue.isRedeDeAbastecimento),
      isAcude: toBoolean(formValue.isAcude),
      isAcudePerene: toBoolean(formValue.isAcudePerene),
      isLagoa: toBoolean(formValue.isLagoa),
      isLagoaPerene: toBoolean(formValue.isLagoaPerene),
      isPoco: toBoolean(formValue.isPoco),
      isPocoPerene: toBoolean(formValue.isPocoPerene),
      isRioOuRiacho: toBoolean(formValue.isRioOuRiacho),
      isRioOuRiachoPerene: toBoolean(formValue.isRioOuRiachoPerene),
      isOlhoDagua: toBoolean(formValue.isOlhoDagua),
      isOlhoDaguaPerene: toBoolean(formValue.isOlhoDaguaPerene),
      isPossuiEnergiaAlternativa: toBoolean(formValue.isPossuiEnergiaAlternativa),
      tipoEnergiaEletrica: formValue.tipoEnergiaEletrica?.value || null,
      usoDaguaAcude: formValue.usoDaguaAcude?.value || null,
      usoDaguaLagoa: formValue.usoDaguaLagoa?.value || null,
      usoDaguaPoco: formValue.usoDaguaPoco?.value || null,
      usoDaguaRioOuRiacho: formValue.usoDaguaRioOuRiacho?.value || null,
      usoDaguaOlhoDagua: formValue.usoDaguaOlhoDagua?.value || null,
      destinacaoDoImovel: formValue.destinacaoDoImovel?.value || null,
      litigio: formValue.litigio?.value || null
    };
  }



  preencherCamposLote(lote: LoteDTO): void {
    this.formEstrutura.patchValue({
      loteId: lote.id,
      numero: lote.numero,
      sncr: lote.sncr,
      area: lote.area,
      denominacaoImovel: lote.denominacaoImovel,
      municipioId: lote.municipioId,
      cpf: lote.cpf,
      perimetro: lote.perimetro
    });

    if (lote.municipioId) {
      this.loadDistritosByMunicipio(lote.municipioId);
    }
  }

  inicializarFormulario(): void {
    this.formEstrutura = this.fb.group({
      // Identificação do lote
      loteId: [null, Validators.required],
      numero: ['', Validators.required],
      sncr: [''],
      area: ['', Validators.required],
      denominacaoImovel: [''],
      municipioId: [null, Validators.required],
      distritoId: [null, Validators.required],
      cpf: [''],
      perimetro: [''],

      // Endereço e localização
      codImoReceita: [''],
      comunidade: [''],
      localidade: [''],
      pontoReferencia: [''],

      // Informações socioeconômicas
      familiasResidentes: [null],
      pessoasResidentes: [null],
      trabalhadoresComCarteira: [null],
      trabalhadoresSemCarteira: [null],
      maoDeObraFamiliar: [null],

      // Valores
      valorTotal: [null],
      valorDasBenfeitorias: [null],
      valorOutrasAtividades: [null],
      valorTerraNua: [null],
      areaIrrigada: [null],

      // Litígios e domínio
      litigio: [''],
      obsLitigio: [''],
      numeroHerdeiros: [null],
      porcentagemDetencao: [null],

      // Destinação
      destinacaoDoImovel: [''],
      entregouMemorialPlanilha: [null],

      // Energia e água
      isFonteAguaExterna: [null],
      isPossuiElergiaEletrica: [null],
      isPossuiEnergiaAlternativa: [null],
      tipoEnergiaEletrica: [''],

      // Recursos hídricos - agrupados por tipo
      isIrrigacao: [null],

      isAcude: [null],
      isAcudePerene: [null],
      usoDaguaAcude: [''],

      isLagoa: [null],
      isLagoaPerene: [null],
      usoDaguaLagoa: [''],

      isPoco: [null],
      isPocoPerene: [null],
      usoDaguaPoco: [''],

      isRioOuRiacho: [null],
      isRioOuRiachoPerene: [null],
      usoDaguaRioOuRiacho: [''],

      isOlhoDagua: [null],
      isOlhoDaguaPerene: [null],
      usoDaguaOlhoDagua: [''],

      isRedeDeAbastecimento: [null]
    });
  }

  carregarMunicipios(): void {
    this.municipioService.getMunicipiosCe().subscribe({
      next: (res) => (this.municipios = res),
      error: (err) => console.error('Erro ao carregar municípios:', err)
    });
  }



  carregarLoteParaEstrutura(loteId: number) {
    this.loteService.obterPorId(loteId).subscribe(lote => {
      this.formEstrutura.patchValue({
        loteId: lote.id,
        numero: lote.numero,
        sncr: lote.sncr,
        area: lote.area,
        denominacaoImovel: lote.denominacaoImovel,
        municipioId: lote.municipio.id,
        pontoReferencia: lote.denominacaoImovel // ou outro valor
      });

      // Opcional: carregar distritos com base no município
      if (lote.municipio.id) {
        this.loadDistritosByMunicipio(lote.municipio.id);
      }
    });
  }


  loadDistritosByMunicipio(municipioId: number): void {
    this.isLoadingDistrito = true;
    this.distritoService.getDistritosByMunicipio(municipioId).subscribe({
      next: (distritos) => {
        this.filteredDistritos = distritos;
        this.formEstrutura.get('distritoId')?.setValue(null);
        this.isLoadingDistrito = false;
      },
      error: () => {
        this.filteredDistritos = [];
        this.formEstrutura.get('distritoId')?.setValue(null);
        this.isLoadingDistrito = false;
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
    const formValue = this.formEstrutura.value;
    const estruturaDTO = this.prepararEstruturaDTO(formValue);

    console.log('Estrutura pronta para envio:', estruturaDTO);

    this.estruturaService.salvar(estruturaDTO).subscribe({
      next: (res) => {
        console.log('✅ Estrutura salva com sucesso!', res);
        this.snackBar.open('Estrutura salva com sucesso!', 'Fechar', { duration: 3000 });
      },
      error: (err) => {
        console.error('❌ Erro ao salvar estrutura:', err);
        this.snackBar.open('Erro ao salvar estrutura', 'Fechar', { duration: 4000 });
      }
    });
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
      next: (res) => (this.lotes = res),
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
    });
  }

  onSubmit(): void {
    if (this.formEstrutura.valid) {
      this.salvarEstrutura();
    } else {
      this.formEstrutura.markAllAsTouched();
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



}
