import { ChangeDetectionStrategy, Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { SituacaoJuridicaService } from '../services/situacao-juridica.service';
import { SituacaoJuridicaDTO } from '../models/situacao-juridica.dto';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MunicipioService } from '../services/municipio.service';
import { DistritoService } from '../services/distrito.service';
import { Distrito } from '../models/distrito';
import { ErrorStateMatcher } from '@angular/material/core';
import { Municipio } from '../models/municipio';

@Component({
  selector: 'app-cadastro-situacao-juridica',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatDividerModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cadastro-situacao-juridica.component.html',
  styleUrl: './cadastro-situacao-juridica.component.scss'
})
export class CadastroSituacaoJuridicaComponent implements OnInit, OnChanges {

  formSituacaoJuridica!: FormGroup;

  errorStateMatcher: ErrorStateMatcher = {
    isErrorState: (control) => !!(control && control.invalid && control.touched),
  };

  isLoadingMunicipio = false;
  isLoadingDistrito = false;
  municipios: Municipio[] = [];
  filteredDistritos: Distrito[] = [];

  @Input() loteId: number | null = null;
  @Input() situacoes: { value: number, viewValue: string }[] = [];
  @Input() obtencoes: { value: number, viewValue: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private situacaoService: SituacaoJuridicaService,
    private municipioService: MunicipioService,
    private distritoService: DistritoService,
  ) { }

  @Input() formGroup!: FormGroup;

  ngOnInit(): void {

    if (!this.formGroup) return;

    this.formGroup.get('situacaoJuridicaId')?.valueChanges.subscribe(value => {
      if (value === 99) {
        this.formGroup.patchValue({
          formaObtencaoSelecionada: '',
          dataPosse: '',
          areaPosse: '',
          livro: '',
          areaRegistrada: '',
          nomeCartorio: '',
          municipioCartorio: '',
          dataRegistro: '',
          oficio: '',
          matricula: '',
          numeroRegistro: ''
        });
      }
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['loteId'] && changes['loteId'].currentValue && this.formGroup) {
      this.formGroup.get('loteId')?.setValue(this.loteId);
    }
  }

  get situacaoSelecionada(): number {
    return this.formGroup.get('situacaoJuridicaId')?.value;
  }

  isSimplesOuJustoTitulo(): boolean {
    const val = this.formGroup.get('situacaoJuridicaId')?.value;
    return val === 1 || val === 2;
  }

  isRegistrada(): boolean {
    return this.formGroup.get('situacaoJuridicaId')?.value === 3;
  }
  
  private formatDate(date: Date | null): string | null {
    if (!date) return null;
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // mês começa em 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  private formatToISO(date: Date | null): string | null {
    return date ? date.toISOString().split('T')[0] : null;
  }

  onSubmit(): void {
    console.log('📋 Form value:', this.formGroup.getRawValue());
    const raw = this.formGroup.value;

    if (!this.formGroup) {
      console.error('❌ Formulário não inicializado!');
      return;
    }

    if (this.formGroup.invalid) {
      console.warn('⚠️ Formulário inválido. Erros por controle:');
      Object.keys(this.formGroup.controls).forEach(control => {
        const c = this.formGroup.get(control);
        if (c && c.invalid) {
          console.warn(`- ${control}:`, c.errors);
        }
      });
      this.formGroup.markAllAsTouched();
      return;
    }

    // 🔁 Converte o código da situação para o texto descritivo
    const situacaoSelecionada = this.situacoes.find(
      s => s.value === raw.situacaoSelecionada
    )?.viewValue ?? raw.situacaoSelecionada;

    const dto: SituacaoJuridicaDTO = {
      ...raw,
      situacaoSelecionada,
      loteId: this.loteId,
      dataPosse: this.formatToISO(raw.dataPosse),
      dataRegistro: this.formatDate(raw.dataRegistro)
    };
    console.log('👉 Enviando situacaoSelecionada:', situacaoSelecionada);
    console.log('✅ Enviando DTO:', dto);
    this.situacaoService.salvar(dto).subscribe({
      next: res => console.log('✅ Salvo com sucesso:', res),
      error: err => console.error('❌ Erro ao salvar:', err)
    });
  }
}  
