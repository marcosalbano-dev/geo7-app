interface ItemDTO {
  id?: number;
  loteId?: number;
  categoriaId?: number | null;
  culturaId?: number | null;
  formaExploracao?: string;
  sequenciaProdutoVegetal?: number | null;
  areaColhida?: number | string | null;
  areaPlantada?: number | string | null;
  quantidadeColhida?: number | string | null;
  codigoUnidadeProducao?: string | null;     // "60", "61", etc.
  granjeiraAgricolaId?: number | null;
  areaExploradaGranjeiraAgricola?: number | string | null;
  areaComOutroUsoId?: number | null;
  areaUtilizada?: number | string | null;
  areasRestricoesId?: number | null;
  areaUtilizadaRestricao?: number | string | null;
  tipoPastagem?: string | null;
  areaPastagem?: number | string | null;
  categoriaAnimalId?: number | null;
  quantidadeAnimal?: number | null;
  areaAproveitavelNaoUtilizada?: number | string | null;
  indicadorGeralDeRestricao?: string | null;
  areaGeralItem?: number | string | null;
}



