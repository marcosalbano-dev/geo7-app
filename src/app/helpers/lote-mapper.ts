import { LoteDTO } from '../models/lote-dto';

// Função para converter os dados do formulário para LoteDTO
export function mapFormToLoteDTO(formValue: any): any {
  // Criar o DTO base com estrutura compatível com o backend
  const dto: any = {
    // Campos obrigatórios - devem ter valores válidos
    numero: formValue.numero || '',
    municipioId: Number(formValue.municipioId) || 0,
    distritoId: Number(formValue.distritoId) || 0,
    situacaoJuridicaId: Number(formValue.situacaoJuridicaId) || 0,
    area: Number(formValue.area) || 0,
    proprietario: formValue.proprietario || '',
    cpf: formValue.cpf || '',
    
    // Campos opcionais - podem ser null se vazios
    perimetro: formValue.perimetro && formValue.perimetro !== null && formValue.perimetro !== '' ? Number(formValue.perimetro) : null,
    dataTerminoPeriodoDeUso: formValue.dataTerminoPeriodoDeUso && formValue.dataTerminoPeriodoDeUso.trim() !== '' ? formValue.dataTerminoPeriodoDeUso : null,
    denominacaoImovel: formValue.denominacaoImovel && formValue.denominacaoImovel.trim() !== '' ? formValue.denominacaoImovel : null, // ✅ ADICIONADO
    sncr: formValue.sncr && formValue.sncr.trim() !== '' ? formValue.sncr : null, // ✅ ADICIONADO
  };

  // Só inclui o ID se existir e for válido (para atualizações)
  if (formValue.id && formValue.id !== null && formValue.id !== '' && formValue.id !== 0) {
    dto.id = Number(formValue.id);
  }

  console.log('🔍 DTO mapeado (compatível com backend):', dto);
  console.log('🔍 DTO tem situacaoJuridicaId?', 'situacaoJuridicaId' in dto);
  console.log('🔍 DTO situacaoJuridicaId valor:', dto.situacaoJuridicaId);
  console.log('🔍 DTO tem denominacaoImovel?', 'denominacaoImovel' in dto);
  console.log('🔍 DTO denominacaoImovel valor:', dto.denominacaoImovel);
  console.log('🔍 DTO tem sncr?', 'sncr' in dto);
  console.log('🔍 DTO sncr valor:', dto.sncr);
  
  return dto;
}

// Função para converter DTO para formulário
export function mapLoteDTOToForm(dto: any): any {
  console.log('🔍 DTO recebido para mapeamento:', dto);
  console.log('🔍 Campos do DTO:', Object.keys(dto));
  
  const formData = {
    id: dto.id || null,
    numero: dto.numero || '',
    area: dto.area || 0,
    perimetro: dto.perimetro || 0,
    cpf: dto.cpf || '',
    proprietario: dto.proprietario || '',
    municipioId: dto.municipioId || null,
    distritoId: dto.distritoId || null,
    situacaoJuridicaId: dto.situacaoJuridicaId || null, // Sem valor padrão
    dataTerminoPeriodoDeUso: dto.dataTerminoPeriodoDeUso || '',
    denominacaoImovel: dto.denominacaoImovel || '', // ✅ ADICIONADO
    sncr: dto.sncr || '', // ✅ ADICIONADO
  };
  
  console.log('🔍 Dados mapeados para formulário:', formData);
  return formData;
}