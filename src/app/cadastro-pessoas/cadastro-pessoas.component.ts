import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

interface municipio {
  value: string;
  viewValue: string;
}

interface distrito {
  value: string;
  viewValue: string;
}

interface litigio {
  value: string;
  viewValue: string;
}

interface estado {
  value: string;
  viewValue: string;
}

interface sexo {
  value: string;
  viewValue: string;
}

interface raca {
  value: string;
  viewValue: string;
}

interface estadoCivil {
  value: string;
  viewValue: string;
}

interface regimeBens {
  value: string;
  viewValue: string;
}

interface tipoDocumento {
  value: string;
  viewValue: string;
}

interface tipoPessoa {
  value: string;
  viewValue: string;
}

interface tipoPoder {
  value: string;
  viewValue: string;
}

interface condicao {
  value: string;
  viewValue: string;
}

interface atividade {
  value: string;
  viewValue: string;
}

interface contrato {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-cadastro-pessoas',
  imports: [
    CommonModule,
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
    ReactiveFormsModule,
    MatIconModule
  ],
  templateUrl: './cadastro-pessoas.component.html',
  styleUrl: './cadastro-pessoas.component.scss'
})
export class CadastroPessoasComponent {

  municipios: municipio[] = [
    { value: 'Abaiara', viewValue: 'Abaiara' },
    { value: 'Acaraú', viewValue: 'Acaraú' },
    { value: 'Chorozinho', viewValue: 'Chorozinho' },
  ];

  distritos: distrito[] = [
    { value: 'Distrito teste 1', viewValue: 'Teste 1' },
    { value: 'Distrito teste 2', viewValue: 'Teste 2' },
    { value: 'Distrito teste 3', viewValue: 'Teste 3' },
  ];

  litigios: litigio[] = [
    { value: 'AreaComPosseiros', viewValue: '09 - Área com Posseiros' },
    { value: 'Limite', viewValue: '17 - Questão de Limite' },
    { value: 'Titulacao', viewValue: '25 - Questão de Titulação' },
  ];

  estados: estado[] = [
    { value: 'acre', viewValue: 'Acre' },
    { value: 'alagoas', viewValue: 'Alagoas' },
    { value: 'amapa', viewValue: 'Amapá' },
  ];

  sexos: sexo[] = [
    { value: 'masculino', viewValue: 'Masculino' },
    { value: 'feminino', viewValue: 'Feminino' },
  ];

  racas: raca[] = [
    { value: 'branca', viewValue: 'Branca' },
    { value: 'preta', viewValue: 'Preta' },
    { value: 'parda', viewValue: 'Parda' },
    { value: 'indigena', viewValue: 'Indígena' },
    { value: 'amarela', viewValue: 'Amarela' },
  ];

  estadosCivis: estadoCivil[] = [
    { value: 'solteiro', viewValue: '1 - Solteiro(a)' },
    { value: 'casado', viewValue: '3 - Casado(a)' },
    { value: 'viuvo', viewValue: '5 - Viúvo(a)' },
    { value: 'desquitado', viewValue: '7 - Desquitado(a)/Sep. Judicial' },
    { value: 'divorciado', viewValue: '9 - Divorciado(a)' },
    { value: 'uniaoEstavel', viewValue: '11 - União Estável' },
  ];

  regimesBens: regimeBens[] = [
    { value: 'comunhaoParcial', viewValue: 'Comunhão Parcial de Bens' },
    { value: 'comunhaoUniversal', viewValue: 'Comunhão Universal de Bens' },
    { value: 'separacaoTotal', viewValue: 'Separação Total de Bens' },
    { value: 'naoInformado', viewValue: 'Não Informado' },
  ];

  tiposDocumentos: tipoDocumento[] = [
    { value: 'carteiraIdentidade', viewValue: '2 - Carteira de Identidade' },
    { value: 'carteiraTrabalho', viewValue: '4 - Carteira de Trabalho' },
    { value: 'carteiraEstrangeiro', viewValue: '6 - Carteira de Estrangeiro' },
    { value: 'outro', viewValue: '8 - Outro' },
  ];

  tiposPessoas = [
    { value: 'FISICA', viewValue: 'Física' },
    { value: 'JURIDICA', viewValue: 'Jurídica' }
  ];

  tiposPoderes = [
    { value: 'executivo', viewValue: 'E - Executivo' },
    { value: 'legislativo', viewValue: 'L - Legislativo' },
    { value: 'judiciario', viewValue: 'J - Judiciário' }
  ];

  tiposGovernos = [
    { value: 'executivo', viewValue: 'E - Executivo' },
    { value: 'legislativo', viewValue: 'L - Legislativo' },
    { value: 'judiciario', viewValue: 'J - Judiciário' }
  ];

  nacionalidades = [
    { value: 'brasileira', viewValue: 'Brasileira' },
    { value: 'estrangeira', viewValue: 'Estrangeira' }
  ];

  ufs = [
    { value: 'ac', viewValue: 'AC' },
    { value: 'al', viewValue: 'AL' },
    { value: 'am', viewValue: 'AM' }
  ];

  condicoes = [
    { value: 'proprietarioPosseiroIndividual', viewValue: '12 - Proprietário ou Posseiro Individual' },
    { value: 'proprietarioPosseiroComum', viewValue: '14 - Proprietário ou Posseiro Comum' },
    { value: 'usufrutario', viewValue: '16 - Usufrutario' }
  ];

  atividades = [
    { value: 'agricola', viewValue: '1 - Agrícola' },
    { value: 'pecuaria', viewValue: '3 - Pecuária' },
    { value: 'granjeira', viewValue: '5 - Granjeira' }
  ];

  tiposContratos = [
    { value: 'escrito', viewValue: 'Escrito' },
    { value: 'verbal', viewValue: 'Verbal' },
  ];

  tipoPessoaSelecionada = signal<string>('FISICA');

  formFisica: FormGroup;
  formJuridica: FormGroup;
  formVinculacao: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formFisica = this.fb.group({
      cpf: [''],
      sexo: [''],
      raca: [''],
      estadoCivil: [''],
      nascimento: [''],
      regimeBens: [''],
      tipoDocumento: [''],
      numeroDocumento: [''],
      orgaoEmissor: [''],
      uf: [''],
      nacionalidade: [''],
      municipio: [''],
      codPaisOrigem: [''],
      codPaisResidencia: [''],
      nomePai: [''],
      nomeMae: [''],
    });

    this.formJuridica = this.fb.group({
      cnpj: [''],
      natureza: [''],
      tipoPoder: [''],
      tipoGoverno: [''],
      uf: [''],
      codPaisSede: [''],
      capitalNacional: [''],
      capitalEstrangeiro: [''],
      regJuntaComercial: [''],
    });

    this.formVinculacao = this.fb.group({
      cnpjcgc: [''],
      natureza: [''],
      tipoGoverno: [''],
      codPaisSede: [''],
      capitalNacional: [''],
      capitalEstrangeiro: [''],
      regJuntaComercial: [''],
      detencao: [''],
      qtdAreaCedida: [''],
      terminoContrato: [''],
    });
  }

  onTipoPessoaChange(value: string) {
    this.tipoPessoaSelecionada.set(value);
  }


}
