import { Component, Input, OnInit, SimpleChanges, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { CONDICOES_PESSOA_IMOVEL } from '../enums/enum-condicao-pessoa-imovel.enum';
import { TIPOS_ATOS } from '../enums/enum-tipos-atos.enum';
import { ATIVIDADE_PRINCIPAL } from '../enums/enum-atividade-principal.enum';
import { PessoaLoteDTO } from '../models/pessoa-lote.dto';
import { LoteService } from '../services/lote.service';
import { PessoaLoteService } from '../services/pessoa-lote.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro-pessoa-lote',
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
  templateUrl: './cadastro-pessoa-lote.component.html',
  styleUrl: './cadastro-pessoa-lote.component.scss'
})
export class CadastroPessoaLoteComponent implements OnInit {
  @Input({ required: true }) 
  formPessoaLote!: FormGroup;
  @Input() loteId: number | null = null;

  CONDICOES = CONDICOES_PESSOA_IMOVEL;
  TIPOS_ATOS = TIPOS_ATOS; 
  ATIVIDADES = ATIVIDADE_PRINCIPAL;

  tiposContratos = [
    { value: 'escrito', viewValue: 'Escrito' },
    { value: 'verbal', viewValue: 'Verbal' },
  ];

  // Condições que exibem os campos "exploração"
  private readonly CONDICOES_EXPLORACAO = [
    '20 - Parceiro', '24 - Comodatário', '26 - Concessionário'
  ];

  constructor(
    private pessoaLoteService: PessoaLoteService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  @Input() formGroup!: FormGroup;

  ngOnInit(): void {}

  salvarPessoaLote(): void {
    const formValue = this.formPessoaLote.value;

    const pessoaLoteDTO: PessoaLoteDTO = {
    pessoaId: formValue.pessoaId,         // ID da pessoa vinculada
    loteId: formValue.loteId,            // ID do lote vinculado
    codigoImovelRural: formValue.codigoImovelRural,                  // Código do imóvel rural
    condicaoPessoaImovelRural: formValue.condicaoPessoaImovelRural,           // Condição da pessoa no imóvel rural
    percentDetencao: formValue.percentDetencao,                    // Percentual de detenção (%)
    isDeclarante: formValue.isDeclarante,                      // É declarante?
    isResideNoImovel: formValue.isResideNoImovel,                  // Reside no imóvel?
    tipoDoAto: formValue.tipoDoAto,                          // Tipo do ato
    numeroAto: formValue.numeroAto,                          // Número do ato
    dataAto: formValue.dataAto,                     // Data do ato
    quantidadeAreaCedida: formValue.quantidadeAreaCedida,               // Área cedida (ha)
    atividadePrincipalExploracao: formValue.atividadePrincipalExploracao,       // Atividade principal de exploração
    contrato: formValue.contrato,                           // Tipo de contrato ("E" ou "V")
    dataTerminoContrato: formValue.dataTerminoContrato,         // Data de término do contrato
    isContratoPrazoIndeterminado: formValue.isContratoPrazoIndeterminado,      // Prazo indeterminado?
    dateCreated: formValue.dateCreated,                 // Data de criação
    lastUpdated: formValue.lastUpdated   
    };

    console.log('🔄 Enviando pessoaLoteDTO:', pessoaLoteDTO);

    this.pessoaLoteService.salvar(pessoaLoteDTO).subscribe(saved => {
      this.snackBar.open('PessoaLote cadastrado com sucesso!', 'Fechar', { duration: 3000 });
      console.log('🚦 PessoaLote salvo:', saved);
    });
  }

   private formatDate(date: Date | null): string | null {
    if (!date) return null;
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // mês começa em 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  

  isExploracao(): boolean {
    const c = this.formPessoaLote.get('condicaoPessoaImovelRural')?.value;
    return this.CONDICOES_EXPLORACAO.includes(c);
  }
}