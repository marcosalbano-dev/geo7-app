// src/app/models/cadastro-pessoas.dto.ts

export interface PessoaDTO {
    id?: number;
    nome: string;
    endereco: string;
    numero: string;
    complemento: string;
    bairro: string;
    municipioResidencia: string;
    uf: string;
    cep: string;
    telefone: string;
    email: string;
    tipoPessoa: 'FISICA' | 'JURIDICA';
  
    // Físico
    cpf?: string;
    sexo?: string;
    nascimento?: string; // "YYYY-MM-DD"
    espolio?: string;
    raca?: string;
    estadoCivil?: string;
    casamento?: string; // "YYYY-MM-DD"
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
    terminoContrato?: string; // "YYYY-MM-DD"
    tipoContrato?: string;
  }
  