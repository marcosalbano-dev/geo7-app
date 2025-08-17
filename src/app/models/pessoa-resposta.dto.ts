export interface PessoaRespostaDTO {
    id: number;
    nome: string;
    telefone?: string;
    fax?: string;
    ramal?: string;
    email?: string;
    nomePai?: string;
    nomeMae?: string;
    dataNascimento?: string; // yyyy-MM-dd
    sexoPessoa?: string;
    isEspolio?: boolean;
  
    codigoPessoaIncra?: string;
    coordenadaEste?: string;
    coordenadaNorte?: string;
    atividadePrincipal?: string;
  
    regimeDeBens?: string;
    dataCasamento?: string;
  
    isRecebePronaf?: boolean;
    isRecebeAjudoProgramaGoverno?: boolean;
    qtdPronaf?: number;
    valorTotalPronafs?: string; // vem como string quando BigDecimal
    racaCor?: string;
  
    pronafsIds?: number[];
  }
  