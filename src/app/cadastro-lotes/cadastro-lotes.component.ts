import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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
import { Router } from '@angular/router';

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
    CommonModule
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

  constructor(
    private fb: FormBuilder,
    private municipioService: MunicipioService,
    private loteService: LoteService,
    private distritoService: DistritoService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.formLotes = this.fb.group({
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
      situacaoJuridicaId: [''],
      dataTerminoPeriodoDeUso: []
    });

    console.log('✅ formLotes inicializado:', this.formLotes);

    this.loadMunicipiosCe();
    this.carregarLotes();

    this.formLotes.get('municipioId')?.valueChanges.subscribe((municipioId) => {
      if (municipioId) {
        this.loadDistritosByMunicipio(municipioId);
      } else {
        this.filteredDistritos = [];
        this.formLotes.get('distritoId')?.reset();
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

    const loteDTO: LoteDTO = {
      numero: formValue.numero,
      sncr: formValue.sncr,
      area: formValue.area,
      denominacaoImovel: formValue.denominacaoImovel,
      perimetro: formValue.perimetro,
      cpf: formValue.cpf,
      proprietario: formValue.proprietario || '',
      municipioId: formValue.municipioId,
      distritoId: formValue.distritoId,
      situacaoJuridicaId: formValue.situacaoJuridicaId || null,
      dataTerminoPeriodoDeUso: formValue.dataTerminoPeriodoDeUso || null,
      formaObtencao: [] // preencha se necessário
    };

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
          area: saved.area,
          denominacaoImovel: saved.denominacaoImovel,
          sncr: saved.sncr
        }
      });
    });
  }

  // irParaCadastroEstrutura(): void {
  //   if (this.formLotes.valid) {
  //     const lote = this.formLotes.value;
  //     this.router.navigate(['/cadastro-estrutura'], {
  //       queryParams: {
  //         numero: lote.numero,
  //         sncr: lote.sncr,
  //         area: lote.area,
  //         denominacaoImovel: lote.denomincaoImovel,
  //         municipioId: lote.municipioId,
  //         distritoId: lote.distritoId
  //       }
  //     });
  //   } else {
  //     this.snackBar.open('Preencha corretamente os dados do lote antes de continuar.', 'Fechar', { duration: 3000 });
  //   }
  // }

  carregarLotes(): void {
    this.loteService.obterTodos().subscribe({
      next: (lotes: LoteDTO[]) => {
        this.lotes = lotes;
        console.log('📦 Lotes carregados:', lotes);
      },
      error: (err) => console.error('Erro ao carregar lotes:', err)
    });
  }

  loadMunicipiosCe(): void {
    this.isLoadingMunicipio = true;
    this.municipioService.getMunicipiosCe().subscribe({
      next: (data) => {
        this.municipios = data;
        this.isLoadingMunicipio = false;
      },
      error: (err) => {
        console.error('Erro ao carregar municípios:', err);
        this.isLoadingMunicipio = false;
      }
    });
  }

  loadDistritosByMunicipio(municipioId: number): void {
    this.isLoadingDistrito = true;
    this.distritoService.getDistritosByMunicipio(municipioId).subscribe({
      next: (distritos) => {
        this.filteredDistritos = distritos;
        this.formLotes.get('distritoId')?.setValue(null);
        this.isLoadingDistrito = false;
      },
      error: () => {
        this.filteredDistritos = [];
        this.formLotes.get('distritoId')?.setValue(null);
        this.isLoadingDistrito = false;
      }
    });
  }

  limparFormulario(): void {
    this.formLotes.reset();
  }
}
