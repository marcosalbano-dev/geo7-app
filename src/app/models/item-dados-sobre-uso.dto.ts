export type GrupoItem =
  | 'Q06_ISOLADO'
  | 'Q07_CONSORCIO_ROTACAO'
  | 'Q08_GRANJEIRA_AQUICOLA'
  | 'Q09_OUTROS_USOS'
  | 'Q10_RESTRICAO'
  | 'Q11_PASTAGEM'
  | 'Q12_INFO_PECUARIA'
  | 'Q13_SEM_RESTRICAO_SEM_USO';


export interface ItemDadosUsoDTO {
       grupo: GrupoItem;

       id?: number;
       loteId?: number;
       categoriaId?: number | null;
       culturaId?: number | null;
       formaExploracao?: 'CONSORCIO' | 'ROTACAO' | null;
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
       denominacaoId?: number;   // usado em "Outros Usos"
       unidadeProducaoId: number;
       // se quiser, meta flexível:
       meta?: Record<string, any>;
}