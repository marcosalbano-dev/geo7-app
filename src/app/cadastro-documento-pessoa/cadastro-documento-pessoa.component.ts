import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
import { Municipio } from '../models/municipio';
import { MunicipioService } from '../services/municipio.service';

interface tipoDocumento {
  value: string;
  viewValue: string;
}

interface estadoCivil {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-cadastro-documento-pessoa',
  standalone: true,
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
  ],
  templateUrl: './cadastro-documento-pessoa.component.html',
  styleUrl: './cadastro-documento-pessoa.component.scss'
})

export class CadastroDocumentoPessoaComponent implements OnInit {

  constructor(private municipioService: MunicipioService){}
  ngOnInit(): void {
   
  }

  @Input() formDocumentoPessoa!: FormGroup;
  @Input() ufs: string[] = [];
  // @Input() pessoaId: number | null = null;
  @Input() loteId: number | null = null;
  @Input() formFisica!: FormGroup;

  municipios: Municipio[] = [];
  isLoadingUf = false;
  isLoadingMunicipio = false;

  tiposGovernos = [
    { value: 'E - Executivo', viewValue: 'E - Executivo' },
    { value: 'L - Legislativo', viewValue: 'L - Legislativo' },
    { value: 'J - Judiciário', viewValue: 'J - Judiciário' }
  ];

  tiposPoderes = [
    { value: 'E - Executivo', viewValue: 'E - Executivo' },
    { value: 'L - Legislativo', viewValue: 'L - Legislativo' },
    { value: 'J - Judiciário', viewValue: 'J - Judiciário' }
  ];

  estadosCivis: estadoCivil[] = [
    { value: 'solteiro', viewValue: '1 - Solteiro(a)' },
    { value: 'casado', viewValue: '3 - Casado(a)' },
    { value: 'viuvo', viewValue: '5 - Viúvo(a)' },
    { value: 'desquitado', viewValue: '7 - Desquitado(a)/Sep. Judicial' },
    { value: 'divorciado', viewValue: '9 - Divorciado(a)' },
    { value: 'uniaoEstavel', viewValue: '11 - União Estável' },
  ];

  tiposDocumentos: tipoDocumento[] = [
    { value: 'carteiraIdentidade', viewValue: '2 - Carteira de Identidade' },
    { value: 'carteiraTrabalho', viewValue: '4 - Carteira de Trabalho' },
    { value: 'carteiraEstrangeiro', viewValue: '6 - Carteira de Estrangeiro' },
    { value: 'outro', viewValue: '8 - Outro' },
  ];

  nacionalidades = [
    { value: 'brasileira', viewValue: 'Brasileira' },
    { value: 'estrangeira', viewValue: 'Estrangeira' }
  ];

  onUfChange(uf: string): void {
    this.isLoadingMunicipio = true;
    // zera o município de naturalidade no próprio form de documento
    this.formDocumentoPessoa.get('naturalidadeId')?.setValue(null);

    this.municipioService.getMunicipiosPorUf(uf).subscribe({
      next: (municipios) => {
        this.municipios = municipios;
        this.isLoadingMunicipio = false;
      },
      error: () => {
        this.municipios = [];
        this.isLoadingMunicipio = false;
      }
    });
  }

}
