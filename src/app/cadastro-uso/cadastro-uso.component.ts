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

interface cultura {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-cadastro-uso',
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
  templateUrl: './cadastro-uso.component.html',
  styleUrl: './cadastro-uso.component.scss'
})
export class CadastroUsoComponent {

  produtoVegetalSelecionado: string = '';

  culturas: cultura[] = [
    {value: 'abacate', viewValue: 'Abacate - 19'},
    {value: 'abacaxi', viewValue: 'Abacaxi - 27'},
    {value: 'abobora', viewValue: 'Abóbora - 841'},
  ];

  isAreaProdutoVegetalIsolado(): boolean {
    return this.produtoVegetalSelecionado === 'Área com Produto Vegetal Isolado';
  }

  isAreaProdutoVegetalConsorcioRotacao(): boolean {
    return this.produtoVegetalSelecionado === 'Área com Produto Vegetal em Consórcio ou Rotação';
  }

}
