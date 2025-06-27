// src/app/models/cadastro-pessoas.ts

export class Pessoa {
    id?: number;
    nome: string | undefined;
    endereco: string | undefined;
    numero: string | undefined;
    complemento: string | undefined;
    bairro: string | undefined;
    municipioResidencia: string | undefined;
    uf: string | undefined;
    cep: string | undefined;
    telefone: string | undefined;
    email: string | undefined;
    tipoPessoa: 'FISICA' | 'JURIDICA';
  
    // Físico
    cpf?: string;
    sexo?: string;
    nascimento?: Date | string;
    espolio?: string;
    raca?: string;
    estadoCivil?: string;
    casamento?: Date | string;
    regimeBens?: string;
    tipoDocumento?: string;
    numeroDocumento?: string;
    orgaoEmissor?: string;
    ufOrgaoEmissor?: string;
    nacionalidade?: string;
    ufNaturalidade?: string;
    municipioNaturalidade?: string;
    codPaisOrigem?: string;
    codPaisResidencia?: string;
    nomePai?: string;
    nomeMae?: string;
  
    // Jurídico
    cnpj?: string;
    natureza?: string;
    tipoPoder?: string;
    tipoGoverno?: string;
    ufPaisSede?: string;
    codPaisSede?: string;
    capitalNacional?: string;
    capitalEstrangeiro?: string;
    regJuntaComercial?: string;
  
    // Vinculação com imóvel rural
    condicao?: string;
    detencao?: string;
    declarante?: string;
    reside?: string;
    atividade?: string;
    qtdAreaCedida?: string;
    terminoContrato?: Date | string;
    tipoContrato?: string;
  
    constructor(init?: Partial<Pessoa>) {
      Object.assign(this, init);
      this.tipoPessoa = init?.tipoPessoa ?? 'FISICA';
    }
  
    static newPessoa(): Pessoa {
      return new Pessoa();
    }
  }
  