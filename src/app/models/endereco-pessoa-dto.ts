export interface EnderecoPessoaDTO {
  id?: number;                       // Opcional para criação
  logradouro: string;
  complemento?: string;
  numero?: string;
  bairro?: string;
  cep?: string;
  codigoPaisResidencia?: string;     // default: "931"
  municipioId?: number;              // FK para Município
  //municipioNome?: string;            // Para exibição no select/lista
  uf?: string;                       // Somente leitura (trazido do backend)
  pessoaId?: number;                 // FK para Pessoa (caso necessário)
}
