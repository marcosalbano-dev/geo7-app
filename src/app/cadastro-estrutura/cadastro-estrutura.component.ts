import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Estrutura } from './estrutura';
import { Lote } from '../cadastro-lotes/lote';
import { EnderecoLote } from '../cadastro-endereco-lote/endereco-lote';
import { Municipio } from '../models/municipio';
import { MunicipioService } from '../services/municipio.service';
import { EstruturaService } from '../services/estrutura.service';

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
    MatListModule,
    MatButtonModule,
    MatIconModule
  ],
  changeDetection : ChangeDetectionStrategy.OnPush,
  templateUrl: './cadastro-estrutura.component.html',
  styleUrl: './cadastro-estrutura.component.scss'
})
export class CadastroEstruturaComponent implements OnInit{

  estrutura: Estrutura = new Estrutura();
  lote: Lote = new Lote();
  enderecoLote: EnderecoLote = new EnderecoLote();

  municipios: Municipio[] = [];
  isLoading = false;
  selectedMunicipio: number | null = null;

  constructor(
    private municipioService: MunicipioService, 
    private estruturaService: EstruturaService
  ) {}

  ngOnInit(): void {
    this.loadMunicipiosCe();
  }

  loadMunicipiosCe(): void {
    this.isLoading = true;
    this.municipioService.getMunicipiosCe().subscribe({
      next: (data) => {
        this.municipios = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar municípios:', error);
        this.isLoading = false;
      }
    });
  }

  salvarEstrutura(): void {
    this.estruturaService.salvar(this.estrutura).subscribe({
      next: (estruturaSalva) => {
        console.log('Estrutura salva com sucesso:', estruturaSalva);
        // Redirecionar ou limpar formulário
      },
      error: (erro) => {
        console.error('Erro ao salvar estrutura:', erro);
      }
    });
  }

  carregarEstruturas(): void {
    this.estruturaService.obterTodas().subscribe({
      next: (estruturas) => {
        console.log('Estruturas carregadas:', estruturas);
      },
      error: (erro) => {
        console.error('Erro ao carregar estruturas:', erro);
      }
    });
  }

  // municipios: municipio[] = [
  //   {value: 'Abaiara', viewValue: 'Abaiara'},
  //   {value: 'Acaraú', viewValue: 'Acaraú'},
  //   {value: 'Chorozinho', viewValue: 'Chorozinho'},
  // ];

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
