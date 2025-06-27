// src/app/models/pessoa-lote.ts

export class PessoaLote {
    id?: number;
  
    // Relacionamentos
    pessoaId?: number;
    loteId?: number;
  
    // Datas
    dateCreated?: Date | string;
    lastUpdated?: Date | string;
  
    // Dados principais
    codigoImovelRural?: string;
    condicaoPessoaImovelRural?: string; // enum futuramente
  
    percentDetencao?: number | string; // BigDecimal no backend; number ou string aqui
    isDeclarante?: boolean;
    isResideNoImovel?: boolean;
  
    tipoDoAto?: string; // "D" (Declarante) ou "P" (Portaria), por exemplo
    numeroAto?: number | string;
    dataAto?: Date | string;
  
    quantidadeAreaCedida?: number | string;
    atividadePrincipalExploracao?: string;
    contrato?: string; // "E" (Escrito), "V" (Verbal)
    dataTerminoContrato?: Date | string;
    isContratoPrazoIndeterminado?: boolean;
  
    constructor(init?: Partial<PessoaLote>) {
      Object.assign(this, init);
    }
  
    static newPessoaLote(): PessoaLote {
      return new PessoaLote();
    }
  }
  