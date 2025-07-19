import { Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { LoteFiltroDTO, LoteService } from '../services/lote.service';
import { Lote } from '../models/lote';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { BuscaAvancadaLotesComponent } from '../busca-avancada-lotes/busca-avancada-lotes.component';
import { Municipio } from '../models/municipio';
import { MunicipioService } from '../services/municipio.service';
import { LoteDTO } from '../models/lote-dto';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { startWith } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';



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
    CommonModule,
    NgxMatSelectSearchModule,
    MatSelectModule
  ],
  templateUrl: './consulta-lotes.component.html',
  styleUrl: './consulta-lotes.component.scss',
  
})

export class ConsultaLotesComponent implements OnInit{

  municipioFiltroCtrl = new FormControl('');
  municipiosFiltrados: Municipio[] = [];
  municipios: Municipio[] = [];
  isLoadingMunicipio = false;
  consultaForm: FormGroup;
  listaLotes: LoteDTO[] = [];
  displayedColumns = ['id', 'numero', 'proprietario', 'denominacaoImovel', 'area', 'situacaoJuridicaId', 'acoes'];

  situacoes = [
    { value: '1', viewValue: 'Posse Por Simples Ocupação' },
    { value: '2', viewValue: 'Posse a Justo Título' },
    { value: '3', viewValue: 'Área Registrada (Domínio)' },
    { value: '99', viewValue: 'Indefinido' }
  ];

  constructor(
    private fb: FormBuilder, 
    private loteService: LoteService,
    private dialog: MatDialog,
    private municipioService: MunicipioService,
    private router: Router
  ) {
    this.consultaForm = this.fb.group({
      proprietario: [''],
      cpf: [''],
      numero: [''],
      municipioId: [''],
      denominacaoImovel: [''],
      situacaoJuridicaId: [''],
    });
  }

  ngOnInit(): void {
    this.loadMunicipiosCe();
    this.municipioFiltroCtrl.valueChanges
    .pipe(startWith(''))
    .subscribe(value => {
      const filterValue = value ? value.toLowerCase() : '';
      this.municipiosFiltrados = this.municipios.filter(mun =>
        mun.nome.toLowerCase().includes(filterValue)
      );
    });

  }
  

  abrirBuscaAvancada() {
    const dialogRef = this.dialog.open(BuscaAvancadaLotesComponent).afterClosed().subscribe(filtro => {
      console.log('Modal fechado:', filtro);
      if (filtro) {
        // Chame o serviço passando o filtro retornado pelo modal
        this.loteService.filtrarLotes(filtro).subscribe(lotes => this.listaLotes = lotes);
      }
    });
  }

  loadMunicipiosCe(): void {
    this.isLoadingMunicipio = true;
    this.municipioService.getMunicipiosCe().subscribe({
      next: (data) => {
        this.municipios = data;
        this.municipiosFiltrados = data; // inicializa a lista filtrada
        this.isLoadingMunicipio = false;
      },
      error: (err) => {
        console.error('Erro ao carregar municípios:', err);
        this.isLoadingMunicipio = false;
      }
    });
  }

  preparaEditarLote(id: string){
    console.log("ID LOTE RECEBIDO: ", id);
    this.router.navigate(['/cadastro-lotes'], { queryParams: {"id": id } });
  }

  preparaEditarEstrutura(id: string){
    console.log("ID ESTRUTURA RECEBIDO: ", id);
    this.router.navigate(['/cadastro-estrutura'], { queryParams: {"id": id } });
  }

  preparaEditarDadosPessoais(id: string){
    console.log("ID DADOS PESSOAIS RECEBIDO: ", id);
    this.router.navigate(['/cadastro-pessoas'], { queryParams: {"id": id } });
  }

  pesquisar() {
    const filtro: LoteFiltroDTO = this.consultaForm.value;
    this.loteService.filtrarLotes(filtro).subscribe({
      next: (lotes) => this.listaLotes = lotes,
      error: (err) => {
        console.error('Erro ao buscar lotes', err);
        this.listaLotes = [];
      }
    });
  }
}
