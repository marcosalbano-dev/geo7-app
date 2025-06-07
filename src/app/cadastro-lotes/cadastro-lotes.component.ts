import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { Lote } from './lote';

@Component({
  selector: 'app-cadastro-lotes',
  imports: [
    FlexLayoutModule, 
    MatCardModule, 
    FormsModule, 
    MatFormFieldModule, 
    MatInputModule
  ],
  templateUrl: './cadastro-lotes.component.html',
  styleUrl: './cadastro-lotes.component.scss'
})
export class CadastroLotesComponent {

  lote: Lote = new Lote();

}
