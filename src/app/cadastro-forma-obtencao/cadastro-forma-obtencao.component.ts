import { NgFor, CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { CadastroSituacaoJuridicaComponent } from '../cadastro-situacao-juridica/cadastro-situacao-juridica.component';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-cadastro-forma-obtencao',
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
    CadastroSituacaoJuridicaComponent,
    MatDatepickerModule
  ],
  templateUrl: './cadastro-forma-obtencao.component.html',
  styleUrl: './cadastro-forma-obtencao.component.scss'
})
export class CadastroFormaObtencaoComponent {
  @Input() form!: FormGroup;

  obtencoes = [
    { value: 1, viewValue: '01 - Aquisição do Governo Estadual' },
    { value: 2, viewValue: '02 - Adjudicação' },
    { value: 3, viewValue: '03 - Aquisição do Governo Federal' },
    { value: 4, viewValue: '04 - Aquisição INCRA' },
    { value: 5, viewValue: '05 - Aquisição do Governo Municipal' },
    { value: 6, viewValue: '06 - Carta de Arrematação' },
    { value: 7, viewValue: '07 - Compra e Venda de Particular' },
    { value: 8, viewValue: '08 - Concessão de Uso/Governo Estadual' },
    { value: 9, viewValue: '09 - Concessão de Uso/Governo Federal' },
    { value: 10, viewValue: '10 - Concessão de Uso/INCRA' },
    { value: 11, viewValue: '11 - Concessão de Uso/Municipal' },
    { value: 12, viewValue: '12 - Doação' },
    { value: 13, viewValue: '13 - Foro ou Enfiteuse' },
    { value: 14, viewValue: '14 - Incorporação' },
    { value: 15, viewValue: '15 - Recebimento de Herança' },
    { value: 16, viewValue: '16 - Usucapião' },
    { value: 17, viewValue: '17 - Usufruto' },
    { value: 18, viewValue: '18 - Doação em Pagamento' },
    { value: 19, viewValue: '19 - Desapropriação' },
    { value: 20, viewValue: '20 - Outras' }
  ];

  formas = [
    { value: '01 - Aquisição do Governo Estadual', viewValue: '01 - Aquisição do Governo Estadual' },
    { value: '02 - Adjudicação', viewValue: '02 - Adjudicação' },
    { value: '03 - Aquisição do Governo Federal', viewValue: '03 - Aquisição do Governo Federal' },
    { value: '04 - Aquisição INCRA', viewValue: '04 - Aquisição INCRA' },
    { value: '05 - Aquisição do Governo Municipal', viewValue: '05 - Aquisição do Governo Municipal' },
    { value: '06 - Carta de Arrematação', viewValue: '06 - Carta de Arrematação' },
    { value: '07 - Compra e Venda de Particular', viewValue: '07 - Compra e Venda de Particular' },
    { value: '08 - Concessão de Uso/Governo Estadual', viewValue: '08 - Concessão de Uso/Governo Estadual' },
    { value: '09 - Concessão de Uso/Governo Federal', viewValue: '09 - Concessão de Uso/Governo Federal' },
    { value: '10 - Concessão de Uso/INCRA', viewValue: '10 - Concessão de Uso/INCRA' },
    { value: '11 - Concessão de Uso/Municipal', viewValue: '11 - Concessão de Uso/Municipal' },
    { value: '12 - Doação', viewValue: '12 - Doação' },
    { value: '13 - Foro ou Enfiteuse', viewValue: '13 - Foro ou Enfiteuse' },
    { value: '14 - Incorporação', viewValue: '14 - Incorporação' },
    { value: '15 - Recebimento de Herança', viewValue: '15 - Recebimento de Herança' },
    { value: '16 - Usucapião', viewValue: '16 - Usucapião' },
    { value: '17 - Usofruto', viewValue: '17 - Usofruto' },
    { value: '18 - Doação em Pagamento', viewValue: '18 - Doação em Pagamento' },
    { value: '19 - Desapropiação', viewValue: '19 - Desapropiação' },
    { value: '20 - Outras', viewValue: '20 - Outras' }
  ];

  constructor() {}

  ngOnInit(): void {}
}


