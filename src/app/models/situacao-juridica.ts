import { Lote } from './lote';

export class SituacaoJuridica {
  id!: number;
  nome: string = '';
  lotes: Lote[] = [];

  constructor() {
    // Inicialização feita nos campos
  }

  toString(): string {
    return this.nome;
  }
}
