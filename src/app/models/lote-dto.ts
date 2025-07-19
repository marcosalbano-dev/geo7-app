// src/app/models/lote-dto.ts

import { FormaObtencaoDTO } from './forma-obtencao-dto';

export interface LoteDTO {
  id?: number;
  numero: string;
  sncr?: string;
  area: number;
  denominacaoImovel?: string;
  perimetro?: number;
  cpf: string;
  proprietario: string;
  municipioId: number;
  distritoId: number;
  situacaoJuridicaId?: number | null;
  situacaoJuridica?: string;
  dataTerminoPeriodoDeUso?: string | null; // ou Date, dependendo do formato esperado
  formaObtencao: FormaObtencaoDTO[];
}
