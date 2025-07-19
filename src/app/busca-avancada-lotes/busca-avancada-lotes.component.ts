// busca-avancada-lotes.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Municipio } from '../models/municipio';
import { MunicipioService } from '../services/municipio.service';
import { MatSelectModule } from '@angular/material/select';


@Component({
  selector: 'app-busca-avancada-lotes',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  template: `
    <h2 mat-dialog-title>Busca Avançada de Imóveis</h2>
    <form [formGroup]="filtroForm">
      <mat-dialog-content>
        <mat-form-field class="full-width">
          <mat-label>Proprietário</mat-label>
          <input matInput formControlName="proprietario" />
        </mat-form-field>
        <mat-form-field class="full-width">
          <mat-label>CPF</mat-label>
          <input matInput formControlName="cpf" />
        </mat-form-field>
        <mat-form-field class="full-width">
          <mat-label>Número do Lote</mat-label>
          <input matInput formControlName="numero" />
        </mat-form-field>
        <mat-form-field class="full-width">
                <mat-label>Município</mat-label>
                <mat-select
                  formControlName="municipioId"
                  (selectionChange)="loadMunicipiosCe()"
                >
                  <mat-option
                    *ngFor="let municipio of municipios"
                    [value]="municipio.id"
                  >
                    {{ municipio.nome }}
                  </mat-option>
                </mat-select>
              </mat-form-field>
        <mat-form-field class="full-width">
          <mat-label>Denominação do Imóvel</mat-label>
          <input matInput formControlName="denominacaoImovel" />
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-stroked-button type="button" (click)="close()">Fechar</button>
        <button mat-flat-button color="primary" (click)="buscar()">Buscar</button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`.full-width { width: 100%; margin-bottom: 8px; }`]
})
export class BuscaAvancadaLotesComponent implements OnInit{
  filtroForm: FormGroup;
  municipios: Municipio[] = [];
  isLoadingMunicipio = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<BuscaAvancadaLotesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private municipioService: MunicipioService,
  ) {
    this.filtroForm = this.fb.group({
      proprietario: [''],
      cpf: [''],
      numero: [''],
      municipioId: [''],
      denominacaoImovel: ['']
    });
    
  }

  ngOnInit(): void {
    this.loadMunicipiosCe();
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

  buscar() {
    console.log('Buscar clicado', this.filtroForm.value);
    this.dialogRef.close(this.filtroForm.value);
    console.log('Chamou close()');
  }

  close() {
    this.dialogRef.close();
  }
}
