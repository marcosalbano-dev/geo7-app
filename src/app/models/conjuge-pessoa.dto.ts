export interface ConjugePessoaDTO {
  id?: number;
  nome: string;
  telefone?: string;
  email?: string;
  nomePai?: string;
  nomeMae?: string;
  dataNascimento?: string; // yyyy-MM-dd format
  sexoPessoa?: string;
  
  // Endereço
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cep?: string;
  
  // Códigos de país
  codigoPaisResidencia?: string;
  codigoPaisOrigem?: string;
  
  // Documentação
  tipoDocumentoIdentificacao?: string;
  descricaoOutroDocumentoIdentificacao?: string;
  numeroDocumentoIdentificacao?: string;
  orgaoEmissor?: string;
  ufOrgaoEmissor?: string;
  tipoNacionalidade?: string;
  cpf: string;
  racaCor?: string;
  conjugeOk?: boolean;
  validadeRne?: string; // yyyy-MM-dd format
  
  // Relacionamentos
  pessoaId: number;
  municipioResidenciaId?: number;
  municipioNaturalidadeId?: number;
  
  // Derivados (calculados no backend)
  uf?: string;
  ufNaturalidade?: string;
}
