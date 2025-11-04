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
import { Location } from '@angular/common';
import { BackButtonComponent } from '../shared/components/back-button/back-button.component';

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
    MatAutocompleteModule,
    BackButtonComponent
  ]
})
export class CadastroEnderecoLoteComponent implements OnInit {

  formEnderecoLote!: FormGroup;

  @Input() loteId: number | null = null;

  atualizando = false;

  municipios: any[] = [];
  distritos: any[] = [];
  lotes: any[] = [];
  lotesFiltrados: any[] = [];
  filteredMunicipios$!: Observable<any[]>;
  filteredDistritos$!: Observable<any[]>;
  isLoadingDistrito = false;

  constructor(
    private fb: FormBuilder,
    private enderecoLoteService: EnderecoLoteService,
    private municipioService: MunicipioService,
    private distritoService: DistritoService,
    private loteService: LoteService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.formEnderecoLote = this.fb.group({
      id: [null],
      loteId: [null], // Opcional
      numero: [''], // Opcional
      municipioId: [null], // Opcional
      distritoId: [null], // Opcional 
      pontoDeReferencia: [''],
      codImoReceita: [''],
      areaUrbana: [0],
      comunidade: [''],
      localidade: [''],
      ativo: [true],
      dhc: [null],
      dhm: [null],
    });

    // 1) carrega lista de municípios e lotes
    this.municipioService.getMunicipiosCe().subscribe(res => {
      this.municipios = res;
      this.setupMunicipioAutocomplete();
    });

    this.loteService.obterTodos().subscribe({
      next: (res) => (this.lotes = res),
      error: (err) => console.error('Erro ao carregar lotes:', err),
    });

    // 2) lê loteId da rota e preenche campos (numero, municipio, distrito)
    const loteId = Number(this.route.snapshot.queryParamMap.get('loteId'));
    if (loteId) {
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

          // completa cabeçalho (numero/municipio/distrito) a partir do lote
          this.loteService.obterPorId(loteId).subscribe(lote => {
            this.formEnderecoLote.patchValue(
              { numero: lote.numero, municipioId: lote.municipioId, distritoId: lote.distritoId },
              { emitEvent: false }
            );
            if (lote.municipioId) {
              this.loadDistritosByMunicipio(lote.municipioId);
            }
          });
        },
        error: err => {
          // 404 -> não existe -> modo salvar
          if (err.status !== 404) console.error(err);
          this.atualizando = false;

          // ainda assim preenche número/município/distrito via lote
          this.loteService.obterPorId(loteId).subscribe(lote => {
            this.formEnderecoLote.patchValue(
              { numero: lote.numero, municipioId: lote.municipioId, distritoId: lote.distritoId },
              { emitEvent: false }
            );
            if (lote.municipioId) {
              this.loadDistritosByMunicipio(lote.municipioId);
            }
          });
        }
      });
    } else {
      // Se não há loteId na rota, permite seleção livre
      this.atualizando = false;
    }
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
  }

  loadDistritosByMunicipio(municipioId: number): Promise<void> {
    this.isLoadingDistrito = true;
    return new Promise((resolve, reject) => {
      this.distritoService.getDistritosByMunicipio(municipioId).subscribe({
        next: (distritos) => {
          this.distritos = distritos;
          this.filteredDistritos$ = of(this.distritos);
          this.isLoadingDistrito = false;
          resolve();
        },
        error: (err) => {
          console.error('Erro ao carregar distritos:', err);
          this.distritos = [];
          this.filteredDistritos$ = of([]);
          this.isLoadingDistrito = false;
          reject();
        },
      });
    });
  }

  onMunicipioChange(municipioId: number): void {
    this.loadDistritosByMunicipio(municipioId);
    this.lotesFiltrados = this.lotes.filter(l => l.municipioId === municipioId);
    // Limpa o distrito quando muda o município
    this.formEnderecoLote.get('distritoId')?.setValue(null);
  }

  onLoteChange(loteId: number): void {
    const lote = this.lotes.find(l => l.id === loteId);
    if (lote) {
      this.formEnderecoLote.patchValue({
        numero: lote.numero,
        municipioId: lote.municipioId,
        distritoId: lote.distritoId
      });
      if (lote.municipioId) {
        this.loadDistritosByMunicipio(lote.municipioId);
      }
    }
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

  getNomeMunicipio(): string {
    const id = this.formEnderecoLote.get('municipioId')?.value;
    const mun = this.municipios.find(m => m.id === id);
    return mun ? mun.nome : '';
  }

  getNomeDistrito(): string {
    const id = this.formEnderecoLote.get('distritoId')?.value;
    return this.distritos.find(d => d.id === id)?.nomeDistrito ?? '';
  }

  getMunicipioNomeByLote(lote: any): string {
    if (!lote || !lote.municipioId) return 'Sem município';
    const municipio = this.municipios.find(m => m.id === lote.municipioId);
    return municipio ? municipio.nome : 'Município não encontrado';
  }

  /** Utils de comparação (caso use compareWith no template) */
  compareMunicipios(m1: any, m2: any): boolean {
    return m1 && m2 ? m1.id === m2.id : m1 === m2;
  }

  compareDistritos(d1: any, d2: any): boolean {
    return d1 && d2 ? d1.id === d2.id : d1 === d2;
  }

  compareLotes(l1: any, l2: any): boolean {
    return l1 && l2 ? l1.id === l2.id : l1 === l2;
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

  onVoltarClick(): void {
    const loteId = this.formEnderecoLote.get('loteId')?.value;
    
    if (loteId) {
      // Navega para a página de dados pessoais (anterior na sequência)
      this.router.navigate(['/cadastro-pessoas'], { 
        queryParams: { loteId: loteId } 
      });
    } else {
      this.location.back();
    }
  }

}
