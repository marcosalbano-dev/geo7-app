

import { Lote } from './lote';
// import { Distrito } from '../ca';

export class EnderecoLote {
  id?: number;
  lote!: Lote;
  ativo: boolean = true;
  dhc: Date = new Date();
  dhm: Date = new Date();
  pontoDeReferencia?: string;
  codImoReceita?: string;
  areaUrbana: number = 0;
//   distrito?: Distrito;
  comunidade?: string;
  localidade?: string;

  constructor(init?: Partial<EnderecoLote>) {
    Object.assign(this, init);
    
    // Garante que as datas são objetos Date
    if (init?.dhc) this.dhc = new Date(init.dhc);
    if (init?.dhm) this.dhm = new Date(init.dhm);
    
    // Converte BigDecimal para number (TypeScript)
    if (init?.areaUrbana) this.areaUrbana = Number(init.areaUrbana);
  }
}