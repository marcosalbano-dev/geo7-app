export interface EnderecoLoteDTO {
  id?: number;
  loteId: number;
  //numero?: string;
  //municipioId: number;
  distritoId: number;
  pontoDeReferencia?: string;
  codImoReceita?: string;
  areaUrbana?: number;
  comunidade?: string;
  localidade?: string;
  ativo?: boolean;
  dhc?: string | Date;
  dhm?: string | Date;
}
