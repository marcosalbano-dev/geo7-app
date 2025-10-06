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
    { value: 'Autônomo', label: 'Autônomo' },
    { value: 'Advogado', label: 'Advogado' },
    { value: 'Agricultor', label: 'Agricultor' },
    { value: 'Aposentado(a)', label: 'Aposentado(a)' },
    { value: 'Assistente Administrativo', label: 'Assistente Administrativo' },
    { value: 'Auxiliar Técnico', label: 'Auxiliar Técnico' },
    { value: 'Bancário', label: 'Bancário' },
    { value: 'Comerciante', label: 'Comerciante' },
    { value: 'Comerciário', label: 'Comerciário' },
    { value: 'Costureira(o)', label: 'Costureira(o)' },
    { value: 'Doméstica', label: 'Doméstica' },
    { value: 'Enfermeira(o)', label: 'Enfermeira(o)' },
    { value: 'Engenheiro(a)', label: 'Engenheiro(a)' },
    { value: 'Garçom', label: 'Garçom' },
    { value: 'Médico(a)', label: 'Médico(a)' },
    { value: 'Militar', label: 'Militar' },
    { value: 'Motorista', label: 'Motorista' },
    { value: 'Músico', label: 'Músico' },
    { value: 'Pedreiro', label: 'Pedreiro' },
    { value: 'Pescador(a)', label: 'Pescador(a)' },
    { value: 'Porteiro', label: 'Porteiro' },
    { value: 'Professor(a)', label: 'Professor(a)' },
    { value: 'Secretária(o)', label: 'Secretária(o)' },
    { value: 'Serviços Gerais', label: 'Serviços Gerais' },
    { value: 'Servidor Publico', label: 'Servidor Publico' },
    { value: 'Vendedor(a)', label: 'Vendedor(a)' },
    { value: 'Outro', label: 'Outro' },
  ];

  tiposPronaf = [
    { value: 'Pronaf Custeio', label: 'Pronaf Custeio' },
    { value: 'Pronaf Investimento(Mais Alimentos)', label: 'Pronaf Investimento(Mais Alimentos)' },
    { value: 'Pronaf Agroecologia', label: 'Pronaf Agroecologia' },
    { value: 'Pronaf Eco', label: 'Pronaf Eco' },
    { value: 'Pronaf Eco Dendê', label: 'Pronaf Eco Dendê' },
    { value: 'Pronaf Eco Seringueira', label: 'Pronaf Eco Seringueira' },
    { value: 'Pronaf Agroindústria', label: 'Pronaf Agroindústria' },
    { value: 'Pronaf Semiarido', label: 'Pronaf Semiarido' },
    { value: 'Pronaf Jovem', label: 'Pronaf Jovem' },
    { value: 'Pronaf Floresta', label: 'Pronaf Floresta' },
    { value: 'Pronaf Custeio e Comercialização de Agroindústrias Familiares ', label: 'Pronaf Custeio e Comercialização de Agroindústrias Familiares' },
    { value: 'Pronaf Cota-Parte', label: 'Pronaf Cota-Parte' },
    { value: 'Pronaf investimento da Reforma Agrária', label: 'Pronaf investimento da Reforma Agrária' },
    { value: 'Pronaf custeio da Reforma Agrária', label: 'Pronaf custeio da Reforma Agrária' },
    { value: 'Pronaf microcrédito da Reforma Agrária', label: 'Pronaf microcrédito da Reforma Agrária' },
    { value: 'Micro crédito rural com a metodologia do PNMPO - Grupo B', label: 'Micro crédito rural com a metodologia do PNMPO - Grupo B' },
    { value: 'Micro crédito rural com a metodologia do PNMPO em municípios em estados de calamidade no semiárido - Grupo "B"', label: 'Micro crédito rural com a metodologia do PNMPO em municípios em estados de calamidade no semiárido - Grupo "B"' },
    { value: 'Grupo "B" - micro crédito rural sem a metodologia do PNMPO', label: 'Grupo "B" - micro crédito rural sem a metodologia do PNMPO' },
    { value: 'Pronaf Mulher(Mulheres enquadradas nos Grupos  "A","A/C" ou "B")', label: 'Pronaf Mulher(Mulheres enquadradas nos Grupos  "A","A/C" ou "B")' },
    { value: 'Pronaf Mulher com a metodologia do PNMPO', label: 'Pronaf Mulher com a metodologia do PNMPO' },
    { value: 'Pronaf Mulher', label: 'Pronaf Mulher' },
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
