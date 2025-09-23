// ===== DTOs que vamos de fato usar =====
export interface MunicipioDTO {
  id: number; nome: string; uf: string;
}

export interface LoteDTO {
  id: number;
  proprietario: string;
  area: number;
  denominacaoImovel: string;
  numero: string;
  sncr?: string | null;
  cpf?: string | null;
  municipioId: number;
  municipioNome: string;
  situacaoJuridicaId?: number | null;
  distritoId?: number | null;
  distritoNome?: string | null;
}

export interface EnderecoLoteDTO {
  id: number;
  loteId: number;
  logradouro?: string | null;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cep?: string | null;
}

export interface FormaObtencaoDTO {
  descricaoFormaDeObtencao?: string | null; // ex: "Adjudicacao"
  dataPosse?: string | null;                // "yyyy-MM-dd"
  areaMedida?: string | null;               // "125.7316"
  numeroHerdeiros?: number | null;
}

export interface EstruturaDTO {
  id: number;
  loteId: number;
  familiasResidentes?: number | null;
  pessoasResidentes?: number | null;
  trabalhadoresComCarteira?: number | null;
  trabalhadoresSemCarteira?: number | null;
  maoDeObraFamiliar?: number | null;
  valorTotal?: number | null;
  valorDasBenfeitorias?: number | null;
  valorOutrasAtividades?: number | null;
  valorTerraNua?: number | null;
  tipoEnergiaEletrica?: string | null;
  isIrrigacao?: boolean | null;
  isPossuiElergiaEletrica?: boolean | null;
  isPossuiEnergiaAlternativa?: boolean | null;
  isRedeDeAbastecimento?: boolean | null;
  isFonteAguaExterna?: boolean | null;
  isAcude?: boolean | null;
  isAcudePerene?: boolean | null;
  isLagoa?: boolean | null;
  isLagoaPerene?: boolean | null;
  isPoco?: boolean | null;
  isPocoPerene?: boolean | null;
  isRioOuRiacho?: boolean | null;
  isRioOuRiachoPerene?: boolean | null;

  usoDaguaAcude?: string | null;
  usoDaguaLagoa?: string | null;
  usoDaguaOlhoDagua?: string | null;
  usoDaguaPoco?: string | null;
  usoDaguaRioOuRiacho?: string | null;

  situacaoJuridicaId?: number | null;
  // forma (vem agregado no DTO pela controller):
  descricaoFormaDeObtencao?: string | null;
  dataPosse?: string | null;
  areaMedida?: string | null;
  numeroHerdeirosForma?: number | null;
}

export interface PessoaDTO {
  id: number;
  nome: string;
  logradouro?: string | null;
  numeroCasa?: string | number | null;
  complemento?: string | null;
  bairro?: string | null;
  nomeMunicipio?: string | null;
  uf?: string | null;
  cep?: string | null;
  ddd?: string | null;
  telefone?: string | null;
  isEspolio?: boolean | null;
  cpf?: string | null;
  dataNascimento?: string | null;
  sexoPessoa?: string | null;
  estadoCivil?: number | null;
  nomeConjuge?: string | null;
  cpfConjuge?: string | null;
  rgConjuge?: string | null;
  orgaoEmissorConjuge?: string | null;
  ufOrgaoEmissorConjuge?: string | null;
  tipoDocumentoIdentificacao?: number | null;
  numeroDocumentoIdentificacao?: string | null;
  orgaoEmissor?: string | null;
  ufOrgaoEmissor?: string | null;
  nacionalidade?: number | null;
  municipioNacionalidade?: string | null;
  ufNaturalidade?: string | null;
  nomePai?: string | null;
  nomeMae?: string | null;
  condicaoPessoaImovelRural?: number | null;
  isDeclarante?: boolean | null;
  isResideNoImovel?: boolean | null;
  percentDetencao?: number | null;
  tipoPessoa?: number | null;
  cnpj?: string | null;
  naturezaJuridica?: number | null;
  ufPaisSede?: string | null;
  capitalNacional?: number | null;
  capitalEstrangeiro?: number | null;
  dataCasamento?: string | null;
  regimeDeBens?: number | null;
  ordem?: number | null;
  coordenadaEste?: string | null;
  coordenadaNorte?: string | null;
  isRecebePronaf?: boolean | null;
  isRecebeAjudoProgramaGoverno?: boolean | null;
  atividadePrincipalExploracao?: string | null;
  valorTotalPronafs?: number | null;
  atividadePrincipal?: string | null;
  qtdPronaf?: number | null;
}

export interface PessoaLoteDTO {
  id: number;
  pessoaId: number;
  loteId: number;
  condicaoPessoaImovelRural?: string | null; // "12 - Proprietário..."
  percentDetencao?: number | null;
  isDeclarante?: boolean | null;
  isResideNoImovel?: boolean | null;
}

export interface EditarDetentorResponseDTO {
  pessoa: PessoaDTO;
  pessoaLote: PessoaLoteDTO;
}

export interface ItemUsoDTO {
  id: number;
  loteId: number;
  categoriaId: number | null;
  culturaId: number | null;
  formaExploracao: string | null;
  sequenciaProdutoVegetal: number | null;
  areaColhida: number | null;
  areaPlantada: number | null;
  quantidadeColhida: number | null;
  unidadeProducaoId: number | null;
  codigoUnidadeProducao: string | null;
  areaComOutroUsoId: number | null;
  areaUtilizada: number | null;
  areasRestricoesId: number | null;
  tipoPastagem: string | null;
  areaPastagem: number | null;
  categoriaAnimalId: number | null;
  quantidadeAnimal: number | null;
  areaAproveitavelNaoUtilizada: number | null;
  indicadorGeralDeRestricao: number | null;
  areaGeralItem: number | null;
  dadosSobreUsoId: number | null;
}

export interface DadosSobreUsoDTO {
  id: number;
  loteId: number;
  items: ItemUsoDTO[];
}

// filtro simples aceito pelo POST /api/lotes/filtrar
export interface LoteFiltroDTO {
  municipioId?: number;
  // acrescente outros campos se seu back exigir
}
