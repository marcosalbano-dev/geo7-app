import { ItemDadosUsoDTO } from "./item-dados-sobre-uso.dto";

  
  export interface DadosSobreUsoDTO {
    id?: number;
    loteId: number;
  
    areaTotalRotacao?: number | null;
    areaTotalConsorcio?: number | null;
    areaTotalIsolado?: number | null;
  
    items: ItemDadosUsoDTO[];
  }
  