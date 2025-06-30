// src/app/models/lote-dto.ts

import { FormaObtencaoDTO } from './forma-obtencao-dto';

export interface LoteDTO {
  id?: number;
  numero: string;
  sncr?: string;
  area: number;
  denominacaoImovel?: string;
  perimetro?: string;
  cpf: string;
  proprietario: string;
  municipioId: number;
  distritoId: number;
  situacaoJuridicaId?: number | null;
  dataTerminoPeriodoDeUso?: string | null; // ou Date, dependendo do formato esperado
  formaObtencao: FormaObtencaoDTO[];
}
