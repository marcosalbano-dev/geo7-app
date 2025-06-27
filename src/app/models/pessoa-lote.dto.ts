// src/app/models/pessoa-lote.dto.ts

export interface PessoaLoteDTO {
    id?: number;
  
    pessoaId: number;          // ID da pessoa vinculada
    loteId: number;            // ID do lote vinculado
  
    codigoImovelRural?: string;                  // Código do imóvel rural
    condicaoPessoaImovelRural?: string;          // Condição da pessoa no imóvel rural
    percentDetencao?: number;                    // Percentual de detenção (%)
    isDeclarante?: boolean;                      // É declarante?
    isResideNoImovel?: boolean;                  // Reside no imóvel?
    tipoDoAto?: string;                          // Tipo do ato
    numeroAto?: number;                          // Número do ato
    dataAto?: string | Date;                     // Data do ato
    quantidadeAreaCedida?: number;               // Área cedida (ha)
    atividadePrincipalExploracao?: string;       // Atividade principal de exploração
    contrato?: string;                           // Tipo de contrato ("E" ou "V")
    dataTerminoContrato?: string | Date;         // Data de término do contrato
    isContratoPrazoIndeterminado?: boolean;      // Prazo indeterminado?
  
    dateCreated?: string | Date;                 // Data de criação
    lastUpdated?: string | Date;                 // Data de atualização
  }
  