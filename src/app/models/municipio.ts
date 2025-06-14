import { Lote } from './lote';

export class Municipio {
  id!: number;
  nome: string = '';
  uf: string = '';
  regiao: string = '';
  microregiao: string = '';
  latitude: number = 0;
  longitude: number = 0;
  areaModuloFiscal: number = 0;
  mesoregiao: string = '';
  lotes: Lote[] = [];

  constructor() {
    // Todos os campos já estão inicializados
  }

  setNome(nome: string): void {
    this.nome = nome?.toUpperCase() ?? '';
  }
}
