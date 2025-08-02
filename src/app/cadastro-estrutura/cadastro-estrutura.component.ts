import { ChangeDetectionStrategy, Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, NgFor } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { Municipio } from '../models/municipio';
import { Distrito } from '../models/distrito';
import { LoteDTO } from '../models/lote-dto';
import { MunicipioService } from '../services/municipio.service';
import { DistritoService } from '../services/distrito.service';
import { LoteService } from '../services/lote.service';
import { EstruturaService } from '../services/estrutura.service';
import { CadastroSituacaoJuridicaComponent } from "../cadastro-situacao-juridica/cadastro-situacao-juridica.component";
import { estruturaDTOToFormValue, mapFormToEstruturaDTO } from '../helpers/estrutura-mapper';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';


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
    CadastroSituacaoJuridicaComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cadastro-estrutura.component.html',
  styleUrl: './cadastro-estrutura.component.scss'
})
export class CadastroEstruturaComponent implements OnInit {

  formEstrutura!: FormGroup;
  municipios: Municipio[] = [];
  filteredDistritos: Distrito[] = [];
  lotes: LoteDTO[] = [];
  lotesFiltrados: LoteDTO[] = [];
  atualizando = false;
  isLoadingMunicipio = false;
  isLoadingDistrito = false;
  loteSelecionado!: LoteDTO;
  numeroLote: string | null = null;

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
    { value: 1, viewValue: 'Posse Por Simples Ocupação' },
    { value: 2, viewValue: 'Posse a Justo Título' },
    { value: 3, viewValue: 'Área Registrada (Domínio)' },
    { value: 4, viewValue: 'Indefinido' }
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
    { value: 20, viewValue: '20 - Outras' }
  ];

  constructor(
    private fb: FormBuilder,
    private loteService: LoteService,
    private municipioService: MunicipioService,
    private distritoService: DistritoService,
    private estruturaService: EstruturaService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Inicialização do form com TODOS os campos
    //  Crie o form ANTES de qualquer coisa!
    console.log('Construindo formEstrutura...');
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

    // Carregar dados de rota, lotes, municipios etc.
    this.route.queryParams.subscribe(params => {
      const loteId = params['id'];
      console.log('loteId: ', loteId);
      if (loteId) {
        this.atualizando = true;
        this.carregarEstruturaPorLoteId(loteId);
      }
      const formaId = this.formEstrutura.get('formaObtencaoId')?.value;
      const descricao = this.obtencoes.find(o => o.value === formaId)?.viewValue || '';
      console.log('formaId: ', formaId);
      console.log('descricao: ', descricao);
      // Patch de dados iniciais vindos de params
      this.paramCache = params;
      console.log('paramCache: ', this.paramCache);
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

    // Desabilite se for readonly
    this.formEstrutura.get('municipioId')?.disable();
    this.formEstrutura.get('numero')?.disable();
    this.formEstrutura.get('distritoId')?.disable();
    this.formEstrutura.get('denominacaoImovel')?.disable();

    // Carregamento inicial de dados
    this.carregarMunicipios();
    this.carregarLotes();

    console.log('FormEstrutura Inicial:', this.formEstrutura.value);
    console.log('Situação selecionada:', this.formEstrutura.value.situacaoSelecionada);

  }

  preencherPessoasComLote(lote: LoteDTO) {
    this.loteSelecionado = lote;
  }

  onMunicipioChange(municipioId: number): void {
    this.loadDistritosByMunicipio(municipioId);
    this.lotesFiltrados = this.lotes.filter(l => l.municipioId === municipioId);
    console.log('📌 Lotes filtrados:', this.lotesFiltrados);
  }

  // // 🚀 Navegar para cadastro de estrutura com dados do lote via query params
  // this.router.navigate(['/cadastro-estrutura'], {
  //   queryParams: {
  //     loteId: loteDTO.id,
  //     numero: loteDTO.numero,
  //     municipioId: loteDTO.municipioId,
  //     distritoId: loteDTO.distritoId,
  //     situacaoJuridicaId: loteDTO.situacaoJuridicaId,
  //     area: loteDTO.area,
  //     denominacaoImovel: loteDTO.denominacaoImovel,
  //     sncr: loteDTO.sncr
  //   }
  // });
  

  atualizarEstrutura(): void {
    if (this.formEstrutura.valid) {

      const formaId = this.formEstrutura.get('formaObtencaoId')?.value;
      const descricao = this.obtencoes.find(o => o.value === formaId)?.viewValue || '';
      this.formEstrutura.patchValue({ descricaoFormaDeObtencao: descricao });

      const estruturaDTO = mapFormToEstruturaDTO(this.formEstrutura);
      console.log('Atualizar - estruturaDTO: ', estruturaDTO)
      this.estruturaService.atualizar(estruturaDTO.id, estruturaDTO).subscribe({
        next: () => {
          this.snackBar.open('Estrutura atualizada com sucesso!', 'Fechar', { duration: 3000 });
            this.router.navigate(['/cadastro-pessoas'], { queryParams: { 
              loteId: estruturaDTO.loteId,
            } });
        },
        error: err => {
          console.error('❌ Erro ao atualizar estrutura:', err);
          this.snackBar.open('Erro ao atualizar estrutura.', 'Fechar', { duration: 3000 });
        }
      });
    } else {
      this.snackBar.open('Formulário inválido.', 'Fechar', { duration: 3000 });
    }
  }

  salvarEstrutura(): void {
    if (!this.formEstrutura.valid) {
      this.formEstrutura.markAllAsTouched();
      this.snackBar.open('Preencha todos os campos obrigatórios.', 'Fechar', { duration: 4000 });
      return;
    }
    const formaId = this.formEstrutura.get('formaObtencaoId')?.value;
    const descricao = this.obtencoes.find(o => o.value === formaId)?.viewValue || '';
    this.formEstrutura.patchValue({ 
      descricaoFormaDeObtencao: descricao,
      formaId: formaId
    });

    const estruturaDTO = mapFormToEstruturaDTO(this.formEstrutura);
    console.log('Salvar - estruturaDTO: ', estruturaDTO)
    console.log('DescricaoFormaDeObtencao enviado:', this.formEstrutura.get('descricaoFormaDeObtencao')?.value);

    this.estruturaService.salvar(estruturaDTO).subscribe({
      next: res => {
        this.snackBar.open('Estrutura salva com sucesso!', 'Fechar', { duration: 3000 });
        const loteId = this.formEstrutura.get('loteId')?.value;
        if (loteId) {
          this.router.navigate(['/cadastro-pessoas'], { queryParams: { loteId } });
        }
      },
      error: err => {
        console.error('❌ Erro ao salvar estrutura:', err);
        this.snackBar.open('Erro ao salvar estrutura', 'Fechar', { duration: 4000 });
      }
    });
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
      situacaoJuridicaId: safeNumber(raw.situacaoJuridicaId),
      // situacaoJuridicaId: typeof raw.situacaoSelecionada === 'object' ? raw.situacaoSelecionada?.id : raw.situacaoSelecionada,
      // situacaoJuridicaNome: raw.situacaoJuridicaNome,
      denominacaoImovel: safeString(raw.denominacaoImovel),
      //situacaoSelecionada: raw.situacaoSelecionada,
      //formaObtencaoSelecionada: raw.formaObtencaoSelecionada,
      formaObtencaoId: raw.formaObtencaoId,
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
      //codImoReceita: safeString(raw.codImoReceita),
      //comunidade: safeString(raw.comunidade),
      //localidade: safeString(raw.localidade),
      area: safeNumber(raw.area),
      sncr: safeString(raw.sncr),
      //pontoReferencia: safeString(raw.pontoReferencia),
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


  // carregarEstruturaPorLoteId(loteId: number) {
  //   this.estruturaService.buscarPorLoteId(loteId).subscribe({
  //     next: (estruturaDTO) => {
  //       if (estruturaDTO) {
  //         console.log('DTO recebido:', estruturaDTO);
  //         // ⚠️ Carregar distritos antes de patchar (para evitar select vazio)
  //         this.loadDistritosByMunicipio(estruturaDTO.municipioId).then(() => {
  //           // Habilita os campos necessários ANTES do patchValue
  //           this.formEstrutura.get('municipioId')?.enable();
  //           this.formEstrutura.get('distritoId')?.enable();
  //           this.formEstrutura.get('numero')?.enable();
  //           this.formEstrutura.get('denominacaoImovel')?.enable();

  //           this.formEstrutura.patchValue({
  //             ...estruturaDTO,
  //             formaObtencaoId: estruturaDTO.formaObtencaoId,
  //             situacaoJuridicaId: estruturaDTO.situacaoJuridicaId,
  //             descricaoFormaDeObtencao: estruturaDTO.descricaoFormaDeObtencao, // para exibição
  //           });

  //           // Desabilita depois do patchValue (se necessário)
  //           this.formEstrutura.get('municipioId')?.disable();
  //           this.formEstrutura.get('distritoId')?.disable();
  //           this.formEstrutura.get('numero')?.disable();
  //           this.formEstrutura.get('denominacaoImovel')?.disable();
  //           this.cd.markForCheck(); // força detecção se necessário

  //           console.log('📦 EstruturaDTO patchado:', estruturaDTO);
  //         });
  //       }
  //     },
  //     error: (err) => {
  //       console.error('❌ Erro ao carregar estrutura:', err);
  //     }

  //   });
  // }

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

  carregarLotes(): void {
    this.loteService.obterTodos().subscribe({
      next: (res) => this.lotes = res,
      error: err => console.error('Erro ao carregar lotes:', err)
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


  private formatToISO(date: Date | string | null): string | null {
    if (!date) return null;
    const d = new Date(date);
    // Corrige para fuso do Brasil 
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0];// yyyy-MM-dd
  }

  carregarEstruturaPorLoteId(loteId: number) {
    this.estruturaService.buscarPorLoteId(loteId).subscribe({
      next: (estruturaDTO) => {
        if (estruturaDTO) {
          this.loadDistritosByMunicipio(estruturaDTO.municipioId).then(() => {
            this.formEstrutura.get('municipioId')?.enable();
            this.formEstrutura.get('distritoId')?.enable();
            this.formEstrutura.get('numero')?.enable();
            this.formEstrutura.get('denominacaoImovel')?.enable();

            // Usa função de mapeamento padronizada para patchValue
            this.formEstrutura.patchValue(estruturaDTOToFormValue(estruturaDTO));

            this.formEstrutura.get('municipioId')?.disable();
            this.formEstrutura.get('distritoId')?.disable();
            this.formEstrutura.get('numero')?.disable();
            this.formEstrutura.get('denominacaoImovel')?.disable();
            this.cd.markForCheck();
          });
        }
      },
      error: err => {
        console.error('❌ Erro ao carregar estrutura:', err);
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

  // carregarLotes(): void {
  //   this.loteService.obterTodos().subscribe({
  //     next: (res) => {
  //       this.lotes = res;
  //       console.log('📦 Todos os lotes carregados:', this.lotes);
  //     },
  //     error: (err) => console.error('Erro ao carregar lotes:', err)
  //   });
  // }

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

    if (this.formEstrutura.valid) {
      this.atualizando ? this.atualizarEstrutura() : this.salvarEstrutura();
    } else {
      this.formEstrutura.markAllAsTouched();
      console.warn('⚠️ Formulário inválido. Corrija os campos.');
    }
  }
}