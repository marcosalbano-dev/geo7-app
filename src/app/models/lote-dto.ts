// src/app/models/lote-dto.ts

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
  situacaoJuridicaId: number; // Obrigatório no backend
  situacaoJuridica?: string;
  dataTerminoPeriodoDeUso?: string | null;
  // Backend espera formaObtencaoSelecionada (string) em vez de formaObtencao (array)
  formaObtencaoSelecionada?: string;
  // Campos adicionais do backend
  dhc?: string | Date;
  dhm?: string | Date;
  municipioNome?: string;
  distritoNome?: string;
  situacaoJuridicaNome?: string;
}
