import { SituacaoJuridica } from '../cadastro-situacao-juridica/situacao-juridica';
import { Lote } from '../cadastro-lotes/lote';

export class FormaObtencao {
  id!: number;
  situacaoJuridica!: SituacaoJuridica;
  lote!: Lote;

  descricaoFormaDeObtencao: string = '';
  oficio: string = '';
  matricula: string = '';
  livro: string = '';
  nomeCartorio: string = '';
  dataRegistro: string = '';
  numeroRegistro: string = '';
  municipioCartorio: string = '';

  areaRegistrada: number = 0;
  areaMedida: number = 0;
  numeroHerdeiros: number = 0;

  dataPosse: Date | null = null;

  constructor() {
    // Inicialização nos próprios campos
  }
}
