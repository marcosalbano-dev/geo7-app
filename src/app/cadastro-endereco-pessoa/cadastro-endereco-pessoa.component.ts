import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Municipio } from '../models/municipio';
import { ErrorStateMatcher } from '@angular/material/core';
import { MunicipioService } from '../services/municipio.service';

@Component({
  selector: 'app-cadastro-endereco-pessoa',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatIconModule,
    MatDividerModule,
    FlexLayoutModule,
    MatDatepickerModule
  ],
  templateUrl: './cadastro-endereco-pessoa.component.html',
  styleUrl: './cadastro-endereco-pessoa.component.scss'
})
export class CadastroEnderecoPessoaComponent implements OnInit, OnChanges {

  @Input() formEnderecoPessoa!: FormGroup; // Recebe do pai!
  ufs: string[] = [];
  municipios: Municipio[] = [];
  isLoadingUf = false;
  isLoadingMunicipio = false;
  @Input() loteId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private municipioService: MunicipioService,
    private cdr: ChangeDetectorRef, 
  ) {
  }

  ngOnInit(): void {
    this.loadUfs();
    const ufCtrl = this.formEnderecoPessoa.get('uf')!;
    // carrega municípios quando a UF mudar (inclusive via patchValue)
    ufCtrl.valueChanges.subscribe(uf => this.loadMunicipios(uf));

    // se o pai já preencheu uf, carrega agora
    const ufInicial = ufCtrl.value;
    if (ufInicial) this.loadMunicipios(ufInicial);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('[EnderecoPessoa] 🔄 ngOnChanges detectado:', changes);
    
    // Se o formEnderecoPessoa mudou, força detecção de mudanças
    if (changes['formEnderecoPessoa'] && this.formEnderecoPessoa) {
      console.log('[EnderecoPessoa] 🔍 Formulário de endereço atualizado:', this.formEnderecoPessoa.value);
      this.cdr.detectChanges();
    }
  }

  errorStateMatcher: ErrorStateMatcher = {
    isErrorState: (control) => !!(control && control.invalid && control.touched),
  };

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

  private loadMunicipios(uf: string): void {
    if (!uf) {
      this.municipios = [];
      this.formEnderecoPessoa.get('municipioId')?.setValue(null, { emitEvent: false });
      return;
    }
    this.isLoadingMunicipio = true;
    this.municipioService.getMunicipiosPorUf(uf).subscribe({
      next: lista => {
        this.municipios = lista;
        const ctrl = this.formEnderecoPessoa.get('municipioId');
        if (ctrl?.value != null) {
          // força o select a reconciliar com as opções já carregadas
          ctrl.setValue(ctrl.value, { emitEvent:false });
        }
        this.isLoadingMunicipio = false;
        this.cdr.detectChanges(); // garante render imediato do label
      },
      error: () => { this.municipios = []; this.isLoadingMunicipio = false; this.cdr.detectChanges(); }
    });
  }

  onUfChange(uf: string): void {
    this.isLoadingMunicipio = true;
    this.municipioService.getMunicipiosPorUf(uf).subscribe({
      next: (municipios) => {
        this.municipios = municipios;
        this.formEnderecoPessoa.get('municipioId')?.setValue(null);
        this.isLoadingMunicipio = false;
      },
      error: () => {
        this.municipios = [];
        this.isLoadingMunicipio = false;
      }
    });
  }

}
