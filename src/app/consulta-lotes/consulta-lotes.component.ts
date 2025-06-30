import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { LoteService } from '../services/lote.service';
import { Lote } from '../models/lote';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-consulta-lotes',
  standalone: true,
  imports: [
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    FlexLayoutModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './consulta-lotes.component.html',
  styleUrl: './consulta-lotes.component.scss',
  
})
export class ConsultaLotesComponent implements OnInit{

  consultaForm: FormGroup;
  listaLotes: Lote[] = [];
  displayedColumns = ['id', 'numero', 'proprietario', 'denominacaoImovel', 'area', 'acoes'];

  constructor(
    private fb: FormBuilder, 
    private loteService: LoteService
  ) {
    this.consultaForm = this.fb.group({
      proprietario: ['']
    });
  }


  ngOnInit(): void {
    
  }

  pesquisar() {
    const proprietario = this.consultaForm.value.proprietario;
    if (!proprietario || !proprietario.trim()) {
      this.listaLotes = [];
      return;
    }
    this.loteService.obterPorProprietario(proprietario).subscribe({
      next: lotes => this.listaLotes = lotes,
      error: () => this.listaLotes = []
    });
  }
}
