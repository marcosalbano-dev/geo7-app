import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EnderecoLoteService } from '../services/endereco-lote.service';
import { MunicipioService } from '../services/municipio.service';
import { DistritoService } from '../services/distrito.service';
import { EnderecoLoteDTO } from '../models/endereco-lote-dto';
import { mapFormToEnderecoLoteDTO } from '../helpers/endereco-lote-mapper';
import { Observable, startWith, map } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDivider, MatDividerModule } from "@angular/material/divider";
import { CommonModule, NgFor } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@Component({
  selector: 'app-cadastro-endereco-lote',
  templateUrl: './cadastro-endereco-lote.component.html',
  styleUrls: ['./cadastro-endereco-lote.component.scss'],
  standalone:true,
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
    MatAutocompleteModule
]
})
export class CadastroEnderecoLoteComponent implements OnInit {

  formEnderecoLote!: FormGroup;

  municipios: any[] = [];
  distritos: any[] = [];
  filteredMunicipios$!: Observable<any[]>;
  filteredDistritos$!: Observable<any[]>;

  constructor(
    private fb: FormBuilder,
    private enderecoLoteService: EnderecoLoteService,
    private municipioService: MunicipioService,
    private distritoService: DistritoService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.formEnderecoLote = this.fb.group({
      id: [null],
      loteId: [null, Validators.required],
      numero: [{ value: '', disabled: true }, Validators.required],
      municipioId: [{ value: null, disabled: true }, Validators.required],
      distritoId: [{ value: null, disabled: true }, Validators.required],
      pontoDeReferencia: ['', Validators.required],
      codImoReceita: ['', Validators.required],
      areaUrbana: [0, [Validators.required, Validators.min(0)]],
      comunidade: [''],
      localidade: [''],
      ativo: [true]
    });

    // Carregar municípios para autocomplete
    this.municipioService.getMunicipiosCe().subscribe(res => {
      this.municipios = res;
      this.setupMunicipioAutocomplete();
    });

    // Atualiza distritos ao mudar município
    this.formEnderecoLote.get('municipioId')?.valueChanges.subscribe(municipioId => {
      if (municipioId) {
        this.distritoService.getDistritosByMunicipio(municipioId).subscribe(distritos => {
          this.distritos = distritos;
          this.setupDistritoAutocomplete();
        });
      }
    });

    // Exemplo de patchValue dos campos desabilitados (via rota/query/serviço externo)
    // this.formEnderecoLote.patchValue({
    //   loteId: 1,
    //   numero: '001',
    //   municipioId: 2300101,
    //   distritoId: 123
    // });
  }

  setupMunicipioAutocomplete() {
    this.filteredMunicipios$ = this.formEnderecoLote.get('municipioId')!.valueChanges.pipe(
      startWith(''),
      map(val => {
        if (!val) return this.municipios;
        return this.municipios.filter((m: any) =>
          m.nome.toLowerCase().includes(val.toLowerCase())
        );
      })
    );
  }

  setupDistritoAutocomplete() {
    this.filteredDistritos$ = this.formEnderecoLote.get('distritoId')!.valueChanges.pipe(
      startWith(''),
      map(val => {
        if (!val) return this.distritos;
        return this.distritos.filter((d: any) =>
          d.nomeDistrito.toLowerCase().includes(val.toLowerCase())
        );
      })
    );
  }

  onSubmit(): void {
    if (this.formEnderecoLote.invalid) {
      this.formEnderecoLote.markAllAsTouched();
      this.snackBar.open('Preencha todos os campos obrigatórios.', 'Fechar', { duration: 4000 });
      return;
    }

    const dto: EnderecoLoteDTO = mapFormToEnderecoLoteDTO(this.formEnderecoLote);
    this.enderecoLoteService.salvar(dto).subscribe({
      next: res => {
        this.snackBar.open('Endereço do Lote salvo!', 'Fechar', { duration: 3000 });
      },
      error: err => {
        this.snackBar.open('Erro ao salvar endereço do lote.', 'Fechar', { duration: 4000 });
      }
    });
  }

  limparFormulario(): void {
    this.formEnderecoLote.reset({ ativo: true, areaUrbana: 0 });
  }

  // Métodos para exibição de erro
  showError(campo: string): boolean {
    const ctrl = this.formEnderecoLote.get(campo);
    return ctrl ? ctrl.invalid && (ctrl.dirty || ctrl.touched) : false;
  }
}
