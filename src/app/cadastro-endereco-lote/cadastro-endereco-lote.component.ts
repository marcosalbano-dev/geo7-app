import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EnderecoLoteService } from '../services/endereco-lote.service';
import { MunicipioService } from '../services/municipio.service';
import { DistritoService } from '../services/distrito.service';
import { EnderecoLoteDTO } from '../models/endereco-lote-dto';
import { enderecoLoteDTOToFormValue, mapFormToEnderecoLoteDTO } from '../helpers/endereco-lote-mapper';
import { Observable, startWith, map, catchError, of } from 'rxjs';
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
import { LoteService } from '../services/lote.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cadastro-endereco-lote',
  templateUrl: './cadastro-endereco-lote.component.html',
  styleUrls: ['./cadastro-endereco-lote.component.scss'],
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

  @Input() loteId: number | null = null;

  atualizando = false;

  municipios: any[] = [];
  distritos: any[] = [];
  filteredMunicipios$!: Observable<any[]>;
  filteredDistritos$!: Observable<any[]>;

  constructor(
    private fb: FormBuilder,
    private enderecoLoteService: EnderecoLoteService,
    private municipioService: MunicipioService,
    private distritoService: DistritoService,
    private loteService: LoteService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.formEnderecoLote = this.fb.group({
      id: [null],
      loteId: [null, Validators.required],
      numero: [{ value: '', disabled: true }, Validators.required],
      municipioId: [{ value: null, disabled: true }], // só display
      distritoId: [{ value: null, disabled: true }], 
      pontoDeReferencia: ['', Validators.required],
      codImoReceita: ['', Validators.required],
      areaUrbana: [0, [Validators.required, Validators.min(0)]],
      comunidade: [''],
      localidade: [''],
      ativo: [true],
      dhc: [null],
      dhm: [null],
    });

    // 1) carrega lista de municípios (antes do patch para o display funcionar)
    this.municipioService.getMunicipiosCe().subscribe(res => {
      this.municipios = res;
      this.setupMunicipioAutocomplete();

      // 2) lê loteId da rota e preenche campos (numero, municipio, distrito)
      const loteId = Number(this.route.snapshot.queryParamMap.get('loteId'));
      if (!loteId) return;

      this.formEnderecoLote.get('loteId')?.setValue(loteId);

      // tenta achar endereço existente p/ o lote
      this.enderecoLoteService.buscarPorLoteId(loteId).subscribe({
        next: dto => {
          // existe -> modo atualização
          this.formEnderecoLote.patchValue({
            id: dto.id,
            loteId: dto.loteId,
            pontoDeReferencia: dto.pontoDeReferencia,
            codImoReceita: dto.codImoReceita,
            areaUrbana: dto.areaUrbana,
            distritoId: dto.distritoId,
            comunidade: dto.comunidade,
            localidade: dto.localidade,
            ativo: dto.ativo ?? true
          }, { emitEvent: false });

          this.atualizando = true;

          // completa cabeçalho (numero/municipio) a partir do lote
          this.loteService.obterPorId(loteId).subscribe(lote => {
            this.formEnderecoLote.patchValue(
              { numero: lote.numero, municipioId: lote.municipioId },
              { emitEvent: false }
            );
            if (lote.municipioId) {
              this.distritoService.getDistritosByMunicipio(lote.municipioId).subscribe(d => {
                this.distritos = d;
                this.filteredDistritos$ = of(this.distritos);
              });
            }
          });
        },
        error: err => {
          // 404 -> não existe -> modo salvar
          if (err.status !== 404) console.error(err);
          this.atualizando = false;

          // ainda assim preenche número/município via lote
          this.loteService.obterPorId(loteId).subscribe(lote => {
            this.formEnderecoLote.patchValue(
              { numero: lote.numero, municipioId: lote.municipioId },
              { emitEvent: false }
            );
            if (lote.municipioId) {
              this.distritoService.getDistritosByMunicipio(lote.municipioId).subscribe(d => {
                this.distritos = d;
                this.filteredDistritos$ = of(this.distritos);
              });
            }
          });
        }
      });
    });
  }

  setupMunicipioAutocomplete() {
    this.filteredMunicipios$ = of(this.municipios);
    // this.filteredMunicipios$ = this.formEnderecoLote.get('municipioId')!.valueChanges.pipe(
    //   startWith(''),
    //   map(val => {
    //     if (!val) return this.municipios;
    //     const termo = typeof val === 'string'
    //       ? val.toLowerCase()
    //       : (this.municipios.find(m => m.id === val)?.nome?.toLowerCase() ?? '');
    //     return this.municipios.filter((m: any) => m.nome.toLowerCase().includes(termo));
    //   })
    // );
  }

  setupDistritoAutocomplete() {
    this.filteredDistritos$ = of(this.distritos);
    // this.filteredDistritos$ = this.formEnderecoLote.get('distritoId')!.valueChanges.pipe(
    //   startWith(''),
    //   map(val => {
    //     if (!val) return this.distritos;
    //     const termo = typeof val === 'string'
    //       ? val.toLowerCase()
    //       : (this.distritos.find(d => d.id === val)?.nomeDistrito?.toLowerCase() ?? '');
    //     return this.distritos.filter((d: any) => d.nomeDistrito.toLowerCase().includes(termo));
    //   })
    // );
  }

  displayMunicipio = (v: any) => {
    const id = typeof v === 'number' ? v : v?.id;
    return this.municipios.find(m => m.id === id)?.nome ?? '';
  };

  displayDistrito = (v: any) => {
    const id = typeof v === 'number' ? v : v?.id;
    return this.distritos.find(d => d.id === id)?.nomeDistrito ?? '';
  };

  getDistritoNome(): string {
    const distritoId = this.formEnderecoLote.get('distritoId')?.value;
    if (!distritoId) return '';
    const distrito = this.distritos.find(d => d.id === distritoId);
    return distrito ? distrito.nomeDistrito : '';
  }

  onSubmit(): void {
    if (this.formEnderecoLote.invalid) {
      this.formEnderecoLote.markAllAsTouched();
      this.snackBar.open('Preencha todos os campos obrigatórios.', 'Fechar', { duration: 4000 });
      return;
    }

    const dto: EnderecoLoteDTO = mapFormToEnderecoLoteDTO(this.formEnderecoLote);

    const id = this.formEnderecoLote.get('id')?.value as number | null;
    const op$ = id
      ? this.enderecoLoteService.atualizar(id, dto)
      : this.enderecoLoteService.salvar(dto);

    op$.subscribe({
      next: res => {
        this.formEnderecoLote.patchValue(enderecoLoteDTOToFormValue(res)); // garante id/datas
        this.snackBar.open('Endereço do Lote salvo!', 'Fechar', { duration: 3000 });
      },
      error: err => {
        this.snackBar.open('Erro ao salvar endereço do lote.', 'Fechar', { duration: 4000 });
      }
    });

  }

  onSalvar(): void {
    if (this.formEnderecoLote.invalid) {
      this.formEnderecoLote.markAllAsTouched();
      this.snackBar.open('Preencha os obrigatórios.', 'Fechar', { duration: 3500 });
      return;
    }
    const dto = mapFormToEnderecoLoteDTO(this.formEnderecoLote);
    
    this.enderecoLoteService.salvar(dto).subscribe({
      next: res => {
        this.snackBar.open('Endereço do lote salvo!', 'Fechar', { duration: 3000 });
        this.formEnderecoLote.patchValue({ id: res.id }, { emitEvent: false });
        this.atualizando = true; // muda para modo atualização
        const loteId =  this.formEnderecoLote.get('loteId')?.value;
        if (loteId) {
        this.router.navigate(
          ['/cadastro-dados-sobre-uso'],
          { queryParams: { loteId }, queryParamsHandling: 'merge' }
        );
      }
    },
      error: () => this.snackBar.open('Erro ao salvar.', 'Fechar', { duration: 4000 })
    });
  }

  onAtualizar(): void {
    if (this.formEnderecoLote.invalid) {
      this.formEnderecoLote.markAllAsTouched();
      this.snackBar.open('Preencha os obrigatórios.', 'Fechar', { duration: 3500 });
      return;
    }
    const id = this.formEnderecoLote.get('id')?.value;
    if (!id) { this.snackBar.open('Registro sem ID.', 'Fechar', { duration: 3000 }); return; }

    const dto = mapFormToEnderecoLoteDTO(this.formEnderecoLote);
    this.enderecoLoteService.atualizar(id, dto).subscribe({
      next: res => {
        this.snackBar.open('Endereço do lote atualizado!', 'Fechar', { duration: 3000 });
        this.formEnderecoLote.patchValue({ id: res.id }, { emitEvent: false });
        this.atualizando = true;

        const loteId =  this.formEnderecoLote.get('loteId')?.value;
        if (loteId) {
        this.router.navigate(
          ['/cadastro-dados-sobre-uso'],
          { queryParams: { loteId }, queryParamsHandling: 'merge' }
        );
      }
    },
      error: () => this.snackBar.open('Erro ao atualizar.', 'Fechar', { duration: 4000 })
    });
  }

  onDelete(): void {
    const id = this.formEnderecoLote.get('id')?.value as number | null;
    if (!id) return;

    if (!confirm('Remover este endereço do lote?')) return;

    this.enderecoLoteService.delete(id).subscribe({
      next: () => {
        this.snackBar.open('Endereço do Lote removido.', 'Fechar', { duration: 3000 });
        this.formEnderecoLote.reset({
          loteId: this.formEnderecoLote.get('loteId')?.value,
          numero: this.formEnderecoLote.get('numero')?.value,
          municipioId: this.formEnderecoLote.get('municipioId')?.value,
          ativo: true,
          areaUrbana: 0
        });
      },
      error: () => this.snackBar.open('Erro ao remover.', 'Fechar', { duration: 4000 })
    });
  }

  limparFormulario(): void {
    this.formEnderecoLote.reset({
      loteId: this.formEnderecoLote.get('loteId')?.value,
      numero: this.formEnderecoLote.get('numero')?.value,
      municipioId: this.formEnderecoLote.get('municipioId')?.value,
      ativo: true,
      areaUrbana: 0
    });
  }

  // Métodos para exibição de erro
  showError(campo: string): boolean {
    const ctrl = this.formEnderecoLote.get(campo);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  // Mostra o nome do município quando o formControl guarda apenas o ID
  // displayMunicipio = (value: any): string => {
  //   const id = typeof value === 'number' ? value : value?.id;
  //   const item = this.municipios.find(m => m.id === id);
  //   return item ? item.nome : '';
  // };

  // // Mostra o nome do distrito quando o formControl guarda apenas o ID
  // displayDistrito = (value: any): string => {
  //   const id = typeof value === 'number' ? value : value?.id;
  //   const item = this.distritos.find(d => d.id === id);
  //   return item ? item.nomeDistrito : '';
  // };

}
