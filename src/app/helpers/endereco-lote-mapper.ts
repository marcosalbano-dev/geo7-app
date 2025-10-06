import { FormGroup } from '@angular/forms';
import { EnderecoLoteDTO } from '../models/endereco-lote-dto';

export function mapFormToEnderecoLoteDTO(form: FormGroup): EnderecoLoteDTO {
  const raw = form.getRawValue();

  return {
    id: raw.id,
    loteId: raw.loteId,
    //numero: raw.numero,
    //municipioId: raw.municipioId,
    distritoId: raw.distritoId,
    pontoDeReferencia: raw.pontoDeReferencia,
    codImoReceita: raw.codImoReceita,
    areaUrbana: raw.areaUrbana,
    comunidade: raw.comunidade,
    localidade: raw.localidade,
    ativo: raw.ativo ?? true,
    dhc: raw.dhc,
    dhm: raw.dhm
  };
}

// (Opcional) Função para preencher o form com dados do DTO (útil em edição/update)
export function enderecoLoteDTOToFormValue(dto: EnderecoLoteDTO): any {
  return {
    id: dto.id ?? null,
    loteId: dto.loteId ?? null,
    ativo: dto.ativo ?? true,
    dhc: dto.dhc ?? null,
    dhm: dto.dhm ?? null,
    pontoDeReferencia: dto.pontoDeReferencia ?? '',
    codImoReceita: dto.codImoReceita ?? '',
    areaUrbana: dto.areaUrbana ?? 0,
    distritoId: dto.distritoId ?? null,
    comunidade: dto.comunidade ?? '',
    localidade: dto.localidade ?? '',
  };
}
