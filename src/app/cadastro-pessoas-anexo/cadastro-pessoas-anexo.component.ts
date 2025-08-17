import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
//import { ProgramaGovernoDTO } from '../models/programa-governo-dto';
//import { ProgramaGovernoService } from '../services/programa-governo.service';

@Component({
  selector: 'app-cadastro-pessoas-anexo',
  standalone: true,
  templateUrl: './cadastro-pessoas-anexo.component.html',
  styleUrl: './cadastro-pessoas-anexo.component.scss',
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
    MatListModule,
    MatButtonModule
  ]
})
export class CadastroPessoasAnexoComponent implements OnInit{

  @Input({ required: true }) formAnexo!: FormGroup;
  @Input() loteId: number | null = null;

  atividadesPrincipais = [
    { value: 'agricultor', label: 'Agricultor' },
    { value: 'pecuarista', label: 'Pecuarista' },
    { value: 'extrativista', label: 'Extrativista' },
    // Adicione mais conforme sua regra
  ];

  tiposPronaf = [
    { value: 'custeio', label: 'Pronaf Custeio' },
    { value: 'investimento', label: 'Pronaf Investimento(Mais Alimentos)' },
    { value: 'agroecologia', label: 'Pronaf Agroecologia' },
    { value: 'eco', label: 'Pronaf Eco' },
    // Adicione todos conforme necessário
  ];

  selectedPronafTipos: string[] = [];
  selectedProgramas: string[] = [];

  constructor(
    private fb: FormBuilder,
  ) {
    this.formAnexo = this.fb.group({
      coordenadaEste: [''],
      coordenadaNorte: [''],
      atividadePrincipal: [''],
      isRecebePronaf: [false],
      qtdPronaf: [0],
      tiposPronaf: [[]],
      valorTotalPronafs: [''],
      recebeProgramaGoverno: [false],
    });
  }

  ngOnInit() {

  }

  togglePronaf(tipo: string) {
    const tipos = this.formAnexo.value.tiposPronaf as string[];
    if (tipos.includes(tipo)) {
      this.formAnexo.patchValue({
        tiposPronaf: tipos.filter(t => t !== tipo)
      });
    } else {
      this.formAnexo.patchValue({
        tiposPronaf: [...tipos, tipo]
      });
    }
  }
  

  // togglePrograma(programa: string) {
  //   const programas = this.formAnexo.value.programasSelecionados as string[];
  //   if (programas.includes(programa)) {
  //     this.formAnexo.patchValue({
  //       programasSelecionados: programas.filter(p => p !== programa)
  //     });
  //   } else {
  //     this.formAnexo.patchValue({
  //       programasSelecionados: [...programas, programa]
  //     });
  //   }
  // }

  onSalvar() {
    console.log(this.formAnexo.value);
    // Salve os dados no backend aqui
  }
}
