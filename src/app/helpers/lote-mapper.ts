import { LoteDTO } from '../models/lote-dto';

// Função para converter os dados do formulário para LoteDTO
export function mapFormToLoteDTO(formValue: any): LoteDTO {
  return {
    id: formValue.id || null,
    numero: formValue.numero,
    sncr: formValue.sncr,
    area: Number(formValue.area), // garante que é number
    denominacaoImovel: formValue.denominacaoImovel,
    perimetro: formValue.perimetro != null && formValue.perimetro !== '' ? Number(formValue.perimetro) : undefined,
    cpf: formValue.cpf,
    proprietario: formValue.proprietario || '',
    municipioId: Number(formValue.municipioId),
    distritoId: Number(formValue.distritoId),
    situacaoJuridicaId: formValue.situacaoJuridicaId ? Number(formValue.situacaoJuridicaId) : null,
    dataTerminoPeriodoDeUso: formValue.dataTerminoPeriodoDeUso || null,
    formaObtencao: formValue.formaObtencao ?? [],
    // adicione outros campos se necessário
  };
}

// Se quiser, pode criar também o inverso, do DTO para o form:
export function mapLoteDTOToForm(dto: LoteDTO): any {
  return {
    id: dto.id,
    numero: dto.numero,
    sncr: dto.sncr,
    area: dto.area,
    denominacaoImovel: dto.denominacaoImovel,
    perimetro: dto.perimetro,
    cpf: dto.cpf,
    proprietario: dto.proprietario,
    municipioId: dto.municipioId,
    distritoId: dto.distritoId,
    situacaoJuridicaId: dto.situacaoJuridicaId,
    dataTerminoPeriodoDeUso: dto.dataTerminoPeriodoDeUso,
    formaObtencao: dto.formaObtencao,
  };
}