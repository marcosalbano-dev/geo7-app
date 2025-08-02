import { FormaObtencao } from '../models/forma-obtencao'

// models/forma-obtencao-dto.ts
export interface FormaObtencaoDTO {
  id?: number;
  descricaoFormaDeObtencao?: string;
  oficio?: string;
  matricula?: string;
  livro?: string;
  nomeCartorio?: string;
  dataRegistro?: string; // usar string para facilitar bind
  numeroRegistro?: string;
  areaRegistrada?: number;
  areaMedida?: number;
  municipioCartorio?: string;
  numeroHerdeiros?: number;
  dataPosse?: string; // ISO string
  loteId: number;
  situacaoJuridicaId: number;
}
