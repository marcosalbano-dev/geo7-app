import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, NgForm } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';


interface municipio {
  value: string;
  viewValue: string;
}

interface situacao {
  value: string;
  viewValue: string;
}

interface obtencao {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-cadastro-situacao-juridica',
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
    CommonModule,
    MatIconModule
  ],
  changeDetection : ChangeDetectionStrategy.OnPush,
  templateUrl: './cadastro-situacao-juridica.component.html',
  styleUrl: './cadastro-situacao-juridica.component.scss'
})
export class CadastroSituacaoJuridicaComponent {
  // @ViewChild('lotesFrm') form!: NgForm;
  situacaoSelecionada: string = '';
  formaObtencaoSelecionada: string = '';

  municipios: municipio[] = [
    {value: 'Abaiara', viewValue: 'Abaiara'},
    {value: 'Acaraú', viewValue: 'Acaraú'},
    {value: 'Chorozinho', viewValue: 'Chorozinho'},
  ];

  situacoes: situacao[] = [
    {value: 'PossePorSimplesOcupacao', viewValue: 'Posse Por Simples Ocupação'},
    {value: 'PosseJustoTitulo', viewValue: 'Posse a Justo Título'},
    {value: 'Dominio', viewValue: 'Área Registrada (Domínio)'},
    {value: 'Indefinido', viewValue: 'Indefinido'},
  ];

  obtencoes: obtencao[] = [
    {value: 'AquisicaoGovEstadual', viewValue: '01 - Aquisição do Governo Estadual'},
    {value: 'Adjudicacao', viewValue: '02 - Adjudicação'},
    {value: 'AquisicaoGovFederal', viewValue: '01 - Aquisição do Governo Federal'},
  ];

  isSimplesOuJustoTitulo(): boolean {
    return this.situacaoSelecionada === 'PossePorSimplesOcupacao' || this.situacaoSelecionada === 'PosseJustoTitulo';
  }
}
