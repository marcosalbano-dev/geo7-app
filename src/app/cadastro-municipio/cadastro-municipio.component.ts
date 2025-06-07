import { Component } from '@angular/core';
import { Municipio } from '../models/municipio';

@Component({
  selector: 'app-cadastro-municipio',
  standalone: true,
  imports: [],
  templateUrl: './cadastro-municipio.component.html',
  styleUrl: './cadastro-municipio.component.scss'
})
export class CadastroMunicipioComponent {

  municipio: Municipio = new Municipio();

}
