export interface DocumentoPessoaDTO {
    id?: number;
  
    pessoaId?: number; // FK para Pessoa, pode ser opcional para criação
  
    tipoDocumentoIdentificacao?: string;
    numeroDocumentoIdentificacao?: string;
    orgaoEmissor?: string;
    ufOrgaoEmissor?: string;
    tipoNacionalidade?: string;
    cpf?: string;
    codigoPaisOrigem?: string;
    estadoCivil?: string;
    tipoPessoa?: string;
    cnpj?: string;
    naturezaJuridica?: string;
    capitalNacional?: number;
    capitalEstrangeiro?: number;
    registroJuntaComercial?: string;
    nomeFantasia?: string;
    codigoPaisSede?: string;
    ufPaisSede?: string;
    tipoDocumentoRepresentanteLegal?: string;
    numeroDocumentoRepresentanteLegal?: string;
    codigoPaisResidencia?: string;
    tipoDePoder?: string;
    tipoDeGoverno?: string;
    percentCapitalNacional?: string;
    percentCapitalEstrangeiro?: string;
    pcePais?: string;
    pcePercentCapital?: string;
    obsevacoesQuadro7?: string;
    naturalidadeId?: number; // FK para Município (naturalidade)
  }
  