import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ConjugePessoaDTO } from '../models/conjuge-pessoa.dto';
import { ConjugePessoaService } from '../services/conjuge-pessoa.service';
import { MunicipioService } from '../services/municipio.service';
import { Municipio } from '../models/municipio';

export interface ConjugeDialogData {
  pessoaId: number;
  pessoaNome: string;
  conjuge?: ConjugePessoaDTO;
  isEditMode?: boolean;
}

@Component({
  selector: 'app-cadastro-conjuge',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatCheckboxModule
  ],
  templateUrl: './cadastro-conjuge.component.html',
  styleUrl: './cadastro-conjuge.component.scss'
})
export class CadastroConjugeComponent implements OnInit {
  formConjuge: FormGroup;
  isLoading = false;
  isSaving = false;
  
  // Listas para selects
  ufs: string[] = [];
  municipios: Municipio[] = [];
  municipiosNaturalidade: Municipio[] = [];
  
  // Estados de loading
  isLoadingUf = false;
  isLoadingMunicipio = false;
  isLoadingMunicipioNaturalidade = false;

  // Opções para selects
  sexos = [
    { value: 'MASCULINO', viewValue: 'Masculino' },
    { value: 'FEMININO', viewValue: 'Feminino' }
  ];

  racas = [
    { value: 'BRANCA', viewValue: 'Branca' },
    { value: 'PRETA', viewValue: 'Preta' },
    { value: 'PARDA', viewValue: 'Parda' },
    { value: 'AMARELA', viewValue: 'Amarela' },
    { value: 'INDIGENA', viewValue: 'Indígena' },
    { value: 'NÃO DESEJA INFORMAR', viewValue: 'Não deseja informar' }
  ];

  nacionalidades = [
    { value: 'BRASILEIRA', viewValue: 'Brasileira' },
    { value: 'ESTRANGEIRA', viewValue: 'Estrangeira' }
  ];

  tiposDocumentos = [
    { value: 'CARTEIRA_IDENTIDADE', viewValue: '2 - Carteira de Identidade' },
    { value: 'CARTEIRA_TRABALHO', viewValue: '4 - Carteira de Trabalho' },
    { value: 'CARTEIRA_ESTRANGEIRO', viewValue: '6 - Carteira de Estrangeiro' },
    { value: 'OUTRO', viewValue: '8 - Outro' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CadastroConjugeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConjugeDialogData,
    private conjugeService: ConjugePessoaService,
    private municipioService: MunicipioService,
    private snackBar: MatSnackBar
  ) {
    this.formConjuge = this.createForm();
  }

  ngOnInit(): void {
    this.loadUfs();
    
    if (this.data.conjuge && this.data.isEditMode) {
      this.loadConjugeData();
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      // Dados pessoais - todos opcionais
      nome: ['', Validators.maxLength(120)], // Opcional
      cpf: ['', Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)], // Opcional - se informado, deve ter formato válido
      dataNascimento: [''],
      sexoPessoa: [''],
      racaCor: [''],
      tipoNacionalidade: [''],
      
      // Contato
      telefone: [''],
      email: ['', [Validators.email]],
      
      // Endereço
      logradouro: [''],
      numero: [''],
      complemento: [''],
      bairro: [''],
      cep: [''],
      municipioResidenciaId: [null],
      codigoPaisResidencia: ['931'],
      
      // Documentação
      tipoDocumentoIdentificacao: [''],
      descricaoOutroDocumentoIdentificacao: [''],
      numeroDocumentoIdentificacao: [''],
      orgaoEmissor: [''],
      ufOrgaoEmissor: ['CE'],
      
      // Naturalidade
      municipioNaturalidadeId: [null],
      codigoPaisOrigem: ['931'],
      
      // Filiação
      nomePai: [''],
      nomeMae: [''],
      
      // Outros
      validadeRne: [''],
      conjugeOk: [false]
    });
  }

  private loadConjugeData(): void {
    if (this.data.conjuge) {
      const conjuge = this.data.conjuge;
      
      // Carrega municípios se necessário
      if (conjuge.municipioResidenciaId) {
        this.loadMunicipiosByUf(conjuge.uf || 'CE');
      }
      
      if (conjuge.municipioNaturalidadeId) {
        this.loadMunicipiosNaturalidadeByUf(conjuge.ufNaturalidade || 'CE');
      }
      
      // Aplica os dados no formulário
      this.formConjuge.patchValue({
        nome: conjuge.nome,
        cpf: this.formatCpfForDisplay(conjuge.cpf),
        dataNascimento: conjuge.dataNascimento ? new Date(conjuge.dataNascimento) : null,
        sexoPessoa: conjuge.sexoPessoa,
        racaCor: conjuge.racaCor,
        tipoNacionalidade: conjuge.tipoNacionalidade,
        telefone: conjuge.telefone,
        email: conjuge.email,
        logradouro: conjuge.logradouro,
        numero: conjuge.numero,
        complemento: conjuge.complemento,
        bairro: conjuge.bairro,
        cep: conjuge.cep,
        municipioResidenciaId: conjuge.municipioResidenciaId,
        codigoPaisResidencia: conjuge.codigoPaisResidencia || '931',
        tipoDocumentoIdentificacao: conjuge.tipoDocumentoIdentificacao,
        descricaoOutroDocumentoIdentificacao: conjuge.descricaoOutroDocumentoIdentificacao,
        numeroDocumentoIdentificacao: conjuge.numeroDocumentoIdentificacao,
        orgaoEmissor: conjuge.orgaoEmissor,
        ufOrgaoEmissor: conjuge.ufOrgaoEmissor || 'CE',
        municipioNaturalidadeId: conjuge.municipioNaturalidadeId,
        codigoPaisOrigem: conjuge.codigoPaisOrigem || '931',
        nomePai: conjuge.nomePai,
        nomeMae: conjuge.nomeMae,
        validadeRne: conjuge.validadeRne ? new Date(conjuge.validadeRne) : null,
        conjugeOk: conjuge.conjugeOk || false
      });
    }
  }

  loadUfs(): void {
    this.isLoadingUf = true;
    this.municipioService.getUfs().subscribe({
      next: (ufs) => {
        this.ufs = ufs;
        this.isLoadingUf = false;
      },
      error: () => {
        this.isLoadingUf = false;
        this.snackBar.open('Erro ao carregar UFs', 'Fechar', { duration: 3000 });
      }
    });
  }

  onUfChange(uf: string): void {
    if (uf) {
      this.loadMunicipiosByUf(uf);
    } else {
      this.municipios = [];
      this.formConjuge.get('municipioResidenciaId')?.setValue(null);
    }
  }

  onUfNaturalidadeChange(uf: string): void {
    if (uf) {
      this.loadMunicipiosNaturalidadeByUf(uf);
    } else {
      this.municipiosNaturalidade = [];
      this.formConjuge.get('municipioNaturalidadeId')?.setValue(null);
    }
  }

  private loadMunicipiosByUf(uf: string): void {
    this.isLoadingMunicipio = true;
    this.municipioService.getMunicipiosPorUf(uf).subscribe({
      next: (municipios: Municipio[]) => {
        this.municipios = municipios;
        this.isLoadingMunicipio = false;
      },
      error: () => {
        this.isLoadingMunicipio = false;
        this.snackBar.open('Erro ao carregar municípios', 'Fechar', { duration: 3000 });
      }
    });
  }

  private loadMunicipiosNaturalidadeByUf(uf: string): void {
    this.isLoadingMunicipioNaturalidade = true;
    this.municipioService.getMunicipiosPorUf(uf).subscribe({
      next: (municipios: Municipio[]) => {
        this.municipiosNaturalidade = municipios;
        this.isLoadingMunicipioNaturalidade = false;
      },
      error: () => {
        this.isLoadingMunicipioNaturalidade = false;
        this.snackBar.open('Erro ao carregar municípios de naturalidade', 'Fechar', { duration: 3000 });
      }
    });
  }

  onSalvar(): void {
    if (this.formConjuge.valid) {
      this.isSaving = true;
      
      const formValue = this.formConjuge.value;
      const conjugeData: ConjugePessoaDTO = {
        ...formValue,
        pessoaId: this.data.pessoaId,
        dataNascimento: formValue.dataNascimento ? formValue.dataNascimento.toISOString().split('T')[0] : undefined,
        validadeRne: formValue.validadeRne ? formValue.validadeRne.toISOString().split('T')[0] : undefined,
        cpf: formValue.cpf.replace(/\D/g, '') // Remove formatação do CPF
      };

      const operation = this.data.isEditMode && this.data.conjuge?.id
        ? this.conjugeService.atualizar(this.data.conjuge.id, conjugeData)
        : this.conjugeService.salvar(conjugeData);

      operation.subscribe({
        next: (conjuge) => {
          this.snackBar.open(
            this.data.isEditMode ? 'Cônjuge atualizado com sucesso!' : 'Cônjuge cadastrado com sucesso!',
            'Fechar',
            { duration: 3000 }
          );
          this.dialogRef.close(conjuge);
        },
        error: (error) => {
          console.error('Erro ao salvar cônjuge:', error);
          this.snackBar.open('Erro ao salvar cônjuge', 'Fechar', { duration: 3000 });
          this.isSaving = false;
        }
      });
    } else {
      this.markFormGroupTouched();
      this.snackBar.open('Por favor, preencha todos os campos obrigatórios', 'Fechar', { duration: 3000 });
    }
  }

  onCancelar(): void {
    this.dialogRef.close();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.formConjuge.controls).forEach(key => {
      const control = this.formConjuge.get(key);
      control?.markAsTouched();
    });
  }

  // Helper para formatar CPF para exibição (quando carrega dados existentes)
  formatCpfForDisplay(cpf: string | undefined): string {
    if (!cpf) return '';
    const cleanCpf = cpf.replace(/\D/g, '');
    if (cleanCpf.length === 11) {
      return cleanCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return cpf; // Retorna o valor original se não conseguir formatar
  }

  // Helper para formatar CPF durante digitação
  formatCpf(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      this.formConjuge.get('cpf')?.setValue(value, { emitEvent: false });
    }
  }

  // Helper para formatar CEP
  formatCep(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length <= 8) {
      value = value.replace(/(\d{5})(\d{3})/, '$1-$2');
      this.formConjuge.get('cep')?.setValue(value, { emitEvent: false });
    }
  }

  // Helper para formatar telefone
  formatTelefone(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      if (value.length <= 10) {
        value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      } else {
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      }
      this.formConjuge.get('telefone')?.setValue(value, { emitEvent: false });
    }
  }
}
