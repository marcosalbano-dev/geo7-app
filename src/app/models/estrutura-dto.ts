// src/app/models/estrutura-dto.ts

export interface EstruturaDTO {
  id: number;
  loteId: number;
  numero?: string;
  situacaoJuridica?: string;
  formaObtencaoId?: number;
  descricaoFormaDeObtencao?: string;
  dataPosse?: string;
  areaPosse?: number;
  livro?: string;
  areaRegistrada?: string;
  areaMedida?: string;
  nomeCartorio?: string;
  municipioCartorio?: string;
  dataRegistro?: string;
  oficio?: string;
  matricula?: string;
  numeroRegistro?: string;
  numeroHerdeiros?: number;
  formaObtencaoSelecionada?: string,
  situacaoSelecionada?: string,
  situacaoJuridicaId?: number,
  ativo?: boolean;
  dhc?: Date;
  dhm?: Date;

  denominacaoImovel?: string;
  distritoId?: number;
  sncr?: string;
  
  // Campos de localização
  localidade?: string;
  comunidade?: string;
  indicacaoLocalizacao?: string;
  pontoDeReferencia?: string;
  codImoReceita?: string;


  familiasResidentes?: number;
  pessoasResidentes?: number;
  trabalhadoresComCarteira?: number;
  trabalhadoresSemCarteira?: number;
  maoDeObraFamiliar?: number;

  valorTotal?: number;
  valorDasBenfeitorias?: number;
  valorOutrasAtividades?: number;
  valorTerraNua?: number;
  areaIrrigada?: number;

  litigio?: string;
  entregouMemorialPlanilha?: boolean;
  destinacaoDoImovel?: string;
  porcentagemDetencao?: number;
  obsLitigio?: string;

  isFonteAguaExterna?: boolean;
  isPossuiElergiaEletrica?: boolean;
  isPossuiEnergiaAlternativa?: boolean;
  tipoEnergiaEletrica?: string;

  isIrrigacao?: boolean;
  isAcude?: boolean;
  isAcudePerene?: boolean;
  usoDaguaAcude?: string;

  isLagoa?: boolean;
  isLagoaPerene?: boolean;
  usoDaguaLagoa?: string;

  isPoco?: boolean;
  isPocoPerene?: boolean;
  usoDaguaPoco?: string;

  isRioOuRiacho?: boolean;
  isRioOuRiachoPerene?: boolean;
  usoDaguaRioOuRiacho?: string;

  isOlhoDagua?: boolean;
  isOlhoDaguaPerene?: boolean;
  usoDaguaOlhoDagua?: string;

  isRedeDeAbastecimento?: boolean;
  municipioId: number;
  area: number;
}
