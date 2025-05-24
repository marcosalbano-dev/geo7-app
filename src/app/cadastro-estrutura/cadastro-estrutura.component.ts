import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

interface municipio {
  value: string;
  viewValue: string;
}

interface distrito {
  value: string;
  viewValue: string;
}

interface destinacao {
  value: string;
  viewValue: string;
}

interface litigio {
  value: string;
  viewValue: string;
}

interface energia {
  value: string;
  viewValue: string;
}

interface usoDaAgua {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-cadastro-estrutura',
  imports: [
    FlexLayoutModule, 
    MatCardModule, 
    FormsModule, 
    MatFormFieldModule, 
    MatInputModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatDividerModule,
    MatListModule
  ],
  templateUrl: './cadastro-estrutura.component.html',
  styleUrl: './cadastro-estrutura.component.scss'
})
export class CadastroEstruturaComponent {
  municipios: municipio[] = [
    {value: 'Abaiara', viewValue: 'Abaiara'},
    {value: 'Acaraú', viewValue: 'Acaraú'},
    {value: 'Chorozinho', viewValue: 'Chorozinho'},
  ];

  distritos: distrito[] = [
    {value: 'Distrito teste 1', viewValue: 'Teste 1'},
    {value: 'Distrito teste 2', viewValue: 'Teste 2'},
    {value: 'Distrito teste 3', viewValue: 'Teste 3'},
  ];

  destinacoes: destinacao[] = [
    {value: 'Hortigranjeiro', viewValue: '01 - Hortigranjeiro'},
    {value: 'ProducaoGraos', viewValue: 'Produção Grãos (Temporários)'},
    {value: 'Agricultura Permanente', viewValue: 'Agricultura Permanente'},
  ];

  litigios: litigio[] = [
    {value: 'AreaComPosseiros', viewValue: '09 - Área com Posseiros'},
    {value: 'Limite', viewValue: '17 - Questão de Limite'},
    {value: 'Titulacao', viewValue: '25 - Questão de Titulação'},
  ];

  energias: energia[] = [
    {value: 'solar', viewValue: 'SOLAR'},
    {value: 'eolica', viewValue: 'EÓLICA'},
  ];

  aguas: usoDaAgua[] = [
    {value: 'usoHumano', viewValue: 'Uso Humano'},
    {value: 'aplicacaoAgricola', viewValue: 'Aplicação Agrícola'},
    {value: 'usoHumanoAgricola', viewValue: 'Uso Humano e Agrícola'},
  ];
}
