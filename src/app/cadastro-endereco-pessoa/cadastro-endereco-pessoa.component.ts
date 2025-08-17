import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
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
export class CadastroEnderecoPessoaComponent implements OnInit{

  @Input() formEnderecoPessoa!: FormGroup; // Recebe do pai!
  console: any;

constructor(
  private fb: FormBuilder,
  private municipioService: MunicipioService
){
 
}

  ngOnInit(): void {
    this.loadUfs();
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

  ufs: string[] = [];
  municipios: Municipio[] = [];
  isLoadingUf = false;
  isLoadingMunicipio = false;
  @Input() loteId: number | null = null;

  onUfChange(uf: string): void {
    this.isLoadingMunicipio = true;
    this.municipioService.getMunicipiosPorUf(uf).subscribe({
      next: (municipios) => {
        this.municipios = municipios;
        this.formEnderecoPessoa.get('municipioResidencia')?.setValue(null);
        this.isLoadingMunicipio = false;
      },
      error: () => {
        this.municipios = [];
        this.isLoadingMunicipio = false;
      }
    });
  }

}
