import { ChangeDetectorRef, Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
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
import { CpfMaskDirective } from '../shared/directives/cpf-mask.directive';

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
    MatButtonModule,
    CpfMaskDirective
  ],
  templateUrl: './cadastro-documento-pessoa.component.html',
  styleUrl: './cadastro-documento-pessoa.component.scss'
})

export class CadastroDocumentoPessoaComponent implements OnInit, OnChanges {

  @Input() formDocumentoPessoa!: FormGroup;
  @Input() ufs: string[] = [];
  @Input() loteId: number | null = null;
  @Input() formFisica!: FormGroup;

  municipios: Municipio[] = [];
  isLoadingUf = false;
  isLoadingMunicipio = false;
  municipiosNaturalidade: { id:number; nome:string }[] = [];

  constructor(private municipioService: MunicipioService, private cdr: ChangeDetectorRef){}
  
  ngOnInit(): void {
    const ufCtrl = this.formDocumentoPessoa.get('ufNaturalidade')!;
    ufCtrl.valueChanges.subscribe(uf => this.loadMunicipiosNaturalidade(uf));
    // dispara o carregamento inicial se já vier UF do backend
    const uf = ufCtrl.value;
    if (uf) this.loadMunicipiosNaturalidade(uf);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('[DocumentoPessoa] 🔄 ngOnChanges detectado:', changes);
    
    // Se o formDocumentoPessoa mudou, força detecção de mudanças
    if (changes['formDocumentoPessoa'] && this.formDocumentoPessoa) {
      console.log('[DocumentoPessoa] 🔍 Formulário de documento atualizado:', this.formDocumentoPessoa.value);
      this.cdr.detectChanges();
    }
    
    // Se o formFisica mudou, força detecção de mudanças
    if (changes['formFisica'] && this.formFisica) {
      console.log('[DocumentoPessoa] 🔍 Formulário físico atualizado:', this.formFisica.value);
      this.cdr.detectChanges();
    }
    
    // Se as UFs mudaram, força detecção de mudanças
    if (changes['ufs'] && this.ufs) {
      console.log('[DocumentoPessoa] 🔍 UFs atualizadas:', this.ufs);
      this.cdr.detectChanges();
    }
  }

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

  private loadMunicipiosNaturalidade(uf: string) {
    if (!uf) { 
      this.municipiosNaturalidade = []; 
      this.formDocumentoPessoa.get('naturalidadeId')?.setValue(null, {emitEvent:false}); 
      return; 
    }
    this.municipioService.getMunicipiosPorUf(uf).subscribe(lista => {
      this.municipiosNaturalidade = lista;
      const ctrl = this.formDocumentoPessoa.get('naturalidadeId');
      if (ctrl?.value != null) {
        ctrl.setValue(ctrl.value, { emitEvent:false }); // reemite o mesmo ID
      }
      this.cdr.detectChanges();
    });
  }

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



}
