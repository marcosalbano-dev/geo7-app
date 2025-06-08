import { Component } from '@angular/core';
import { Distrito } from '../models/distrito';

@Component({
  selector: 'app-cadastro-distrito',
  standalone: true,
  imports: [],
  templateUrl: './cadastro-distrito.component.html',
  styleUrl: './cadastro-distrito.component.scss'
})
export class CadastroDistritoComponent {

  distrito: Distrito = new Distrito();

}
