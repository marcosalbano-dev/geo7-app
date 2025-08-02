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
    private route: ActivatedRoute // Captura dados da rota que foi acessada
  ) { }

  ngOnInit(): void {
    this.formLotes = this.fb.group({
      id: [null],
      proprietario: ['', Validators.required],
      area: ['', Validators.required],
      denominacaoImovel: [''],
      numero: ['', Validators.required],
      perimetro: [''],
      sncr: [''],
      cpf: ['', Validators.required],
      municipioId: [null, Validators.required],
      distritoId: [null, Validators.required],
      formaObtencao: [''],
      situacaoJuridicaId: [null],
      dataTerminoPeriodoDeUso: [],
      situacaoJuridicaNome: [''],
      nomeDistrito: [''],
    });
    console.log('✅ formLotes inicializado:', this.formLotes);

    this.loadMunicipiosCe();
    this.carregarLotes();

    this.loadMunicipiosCe().then(() => {
      this.route.queryParams.subscribe(params => {
        const id = params['id'];
        if (id) {
          this.atualizando = true;
          this.carregarLotePorId(+id); // só carrega depois que municípios estão prontos
        }
      });
    });


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
    this.loteService.obterPorId(id).subscribe({
      next: (loteDto: LoteDTO) => {
        this.loteSelecionado = loteDto;
        console.log('LOTE:', loteDto);

        this.loadDistritosByMunicipio(loteDto.municipioId).then(() => {
          const formPatch = mapLoteDTOToForm(loteDto);
          this.formLotes.patchValue(formPatch);
        });
      },
      error: (err) => {
        console.error('Erro ao buscar lote:', err);
      }
    });
  }

  onSubmit(): void {
    console.log('Valid:', this.formLotes.valid);
    console.log('Form Value:', this.formLotes.value);

    if (this.formLotes.valid) {
      this.salvarLote();
    } else {
      this.formLotes.markAllAsTouched();
    }
  }

  salvarLote(): void {
    const formValue = this.formLotes.value;
    const loteDTO = mapFormToLoteDTO(formValue);

    console.log('🔄 Enviando loteDTO:', loteDTO);

    this.loteService.salvar(loteDTO).subscribe(saved => {
      this.snackBar.open('Lote cadastrado com sucesso!', 'Fechar', { duration: 3000 });
      console.log('🚦 Lote salvo:', saved);
      // 🚀 Navegar para cadastro de estrutura com dados do lote via query params
      this.router.navigate(['/cadastro-estrutura'], {
        queryParams: {
          loteId: saved.id,
          numero: saved.numero,
          municipioId: saved.municipioId,
          distritoId: saved.distritoId,
          situacaoJuridicaId: saved.situacaoJuridicaId,
          area: saved.area,
          denominacaoImovel: saved.denominacaoImovel,
          sncr: saved.sncr
        }
      });
    });

  }

  atualizarLote() {
    const loteDTO = this.formLotes.value;
    console.log('Atualizando lote com ID:', loteDTO.id); // Debug

    if (this.formLotes.valid && loteDTO.id) {
      this.loteService.atualizar(loteDTO.id, loteDTO).subscribe({
        next: (res) => {
          this.snackBar.open('Lote atualizado com sucesso!', 'Fechar', { duration: 3000 });
          console.log('🚦 Lote salvo:', loteDTO);
          // 🚀 Navegar para cadastro de estrutura com dados do lote via query params
          this.router.navigate(['/cadastro-estrutura'], {
            queryParams: {
              loteId: loteDTO.id,
              numero: loteDTO.numero,
              municipioId: loteDTO.municipioId,
              distritoId: loteDTO.distritoId,
              situacaoJuridicaId: loteDTO.situacaoJuridicaId,
              area: loteDTO.area,
              denominacaoImovel: loteDTO.denominacaoImovel,
              sncr: loteDTO.sncr
            }
          });
        },
        error: (err) => {
          console.error('Erro ao atualizar Lote', err);
          this.snackBar.open('Erro ao atualizar lote.', 'Fechar', { duration: 3000 });
        }
      });
    } else {
      this.snackBar.open('Formulário inválido ou ID ausente.', 'Fechar', { duration: 3000 });
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

  limparFormulario(): void {
    this.formLotes.reset();
  }
}
