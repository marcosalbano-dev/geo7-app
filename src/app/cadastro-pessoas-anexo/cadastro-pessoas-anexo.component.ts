import { Component, Input } from '@angular/core';
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
export class CadastroPessoasAnexoComponent {

  @Input({ required: true }) formGroup!: FormGroup;

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

  programasGoverno = [
    { value: 'bolsa_familia', label: 'BOLSA FAMÍLIA' },
    { value: 'bolsa_safra', label: 'BOLSA SAFRA' },
    // Adicione todos conforme necessário
  ];

  selectedPronafTipos: string[] = [];
  selectedProgramas: string[] = [];

  constructor(private fb: FormBuilder) {
    this.formGroup = this.fb.group({
      utmEste: [''],
      utmNorte: [''],
      atividadePrincipal: [''],
      recebePronaf: [false],
      qtdPronaf: [0],
      tiposPronaf: [[]],
      valorTotalPronafs: [''],
      recebeProgramaGoverno: [false],
      programasSelecionados: [[]],
    });
  }

  togglePronaf(tipo: string) {
    const tipos = this.formGroup.value.tiposPronaf as string[];
    if (tipos.includes(tipo)) {
      this.formGroup.patchValue({
        tiposPronaf: tipos.filter(t => t !== tipo)
      });
    } else {
      this.formGroup.patchValue({
        tiposPronaf: [...tipos, tipo]
      });
    }
  }
  

  togglePrograma(programa: string) {
    const programas = this.formGroup.value.programasSelecionados as string[];
    if (programas.includes(programa)) {
      this.formGroup.patchValue({
        programasSelecionados: programas.filter(p => p !== programa)
      });
    } else {
      this.formGroup.patchValue({
        programasSelecionados: [...programas, programa]
      });
    }
  }

  onSalvar() {
    console.log(this.formGroup.value);
    // Salve os dados no backend aqui
  }
}
