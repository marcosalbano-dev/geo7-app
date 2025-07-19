import { FormGroup } from '@angular/forms';
import { EstruturaDTO } from '../models/estrutura-dto';

// Helpers para conversão segura
function safeString(value: any): string | undefined {
  if (value === null || value === undefined || value === 'null') return undefined;
  return String(value);
}
function safeNumber(value: any): number | undefined {
  if (
    value === null ||
    value === undefined ||
    value === '' ||
    value === 'null' ||
    isNaN(Number(value))
  )
    return undefined;
  return Number(value);
}
function safeBoolean(value: any): boolean | undefined {
  if (value === null || value === undefined || value === 'null') return undefined;
  return Boolean(value);
}

export function mapFormToEstruturaDTO(form: FormGroup): EstruturaDTO {
  const raw = form.getRawValue();

  return {
    id: safeNumber(raw.id)!,
    loteId: safeNumber(raw.loteId)!,
    situacaoJuridicaId: typeof raw.situacaoSelecionada === 'object'
      ? safeNumber(raw.situacaoSelecionada.id)
      : safeNumber(raw.situacaoSelecionada),

    formaObtencaoSelecionada:
      typeof raw.formaObtencaoSelecionada === 'object'
        ? raw.formaObtencaoSelecionada.value
        : raw.formaObtencaoSelecionada,

    ativo: safeBoolean(raw.ativo),
    dhc: raw.dhc ? new Date(raw.dhc) : undefined,
    dhm: raw.dhm ? new Date(raw.dhm) : undefined,

    familiasResidentes: safeNumber(raw.familiasResidentes),
    pessoasResidentes: safeNumber(raw.pessoasResidentes),
    trabalhadoresComCarteira: safeNumber(raw.trabalhadoresComCarteira),
    trabalhadoresSemCarteira: safeNumber(raw.trabalhadoresSemCarteira),
    maoDeObraFamiliar: safeNumber(raw.maoDeObraFamiliar),

    valorTotal: safeNumber(raw.valorTotal),
    valorDasBenfeitorias: safeNumber(raw.valorDasBenfeitorias),
    valorOutrasAtividades: safeNumber(raw.valorOutrasAtividades),
    valorTerraNua: safeNumber(raw.valorTerraNua),
    areaIrrigada: safeNumber(raw.areaIrrigada),

    litigio:
    typeof raw.litigio === 'object'
      ? raw.litigio.value
      : raw.litigio,

    entregouMemorialPlanilha: safeBoolean(raw.entregouMemorialPlanilha),

    destinacaoDoImovel:
    typeof raw.destinacaoDoImovel === 'object'
      ? raw.destinacaoDoImovel.value
      : raw.destinacaoDoImovel,

    pontoDeReferencia: safeString(raw.pontoDeReferencia),
    numeroHerdeiros: safeNumber(raw.numeroHerdeiros),
    porcentagemDetencao: safeNumber(raw.porcentagemDetencao),
    obsLitigio: safeString(raw.obsLitigio),

    isFonteAguaExterna: safeBoolean(raw.isFonteAguaExterna),
    isPossuiElergiaEletrica: safeBoolean(raw.isPossuiElergiaEletrica),
    isPossuiEnergiaAlternativa: safeBoolean(raw.isPossuiEnergiaAlternativa),
    tipoEnergiaEletrica:
    typeof raw.tipoEnergiaEletrica === 'object'
      ? raw.tipoEnergiaEletrica.value
      : raw.tipoEnergiaEletrica,

    isIrrigacao: safeBoolean(raw.isIrrigacao),
    isAcude: safeBoolean(raw.isAcude),
    isAcudePerene: safeBoolean(raw.isAcudePerene),

    usoDaguaAcude:
    typeof raw.usoDaguaAcude === 'object'
      ? raw.usoDaguaAcude.value
      : raw.usoDaguaAcude,

    isLagoa: safeBoolean(raw.isLagoa),
    isLagoaPerene: safeBoolean(raw.isLagoaPerene),
    usoDaguaLagoa:
    typeof raw.usoDaguaLagoa === 'object'
      ? raw.usoDaguaLagoa.value
      : raw.usoDaguaLagoa,

    isPoco: safeBoolean(raw.isPoco),
    isPocoPerene: safeBoolean(raw.isPocoPerene),
    usoDaguaPoco:
    typeof raw.usoDaguaPoco === 'object'
      ? raw.usoDaguaPoco.value
      : raw.usoDaguaPoco,

    isRioOuRiacho: safeBoolean(raw.isRioOuRiacho),
    isRioOuRiachoPerene: safeBoolean(raw.isRioOuRiachoPerene),
    usoDaguaRioOuRiacho:
    typeof raw.usoDaguaRioOuRiacho === 'object'
      ? raw.usoDaguaRioOuRiacho.value
      : raw.usoDaguaRioOuRiacho,

    isOlhoDagua: safeBoolean(raw.isOlhoDagua),
    isOlhoDaguaPerene: safeBoolean(raw.isOlhoDaguaPerene),
    usoDaguaOlhoDagua:
    typeof raw.usoDaguaOlhoDagua === 'object'
      ? raw.usoDaguaOlhoDagua.value
      : raw.usoDaguaOlhoDagua,

    isRedeDeAbastecimento: safeBoolean(raw.isRedeDeAbastecimento),
    municipioId: safeNumber(raw.municipioId)!,
    area: safeNumber(raw.area)!
  };
}

export function estruturaDTOToFormValue(dto: Partial<EstruturaDTO>) {
  return {
    id: dto.id ?? undefined,
    loteId: dto.loteId ?? undefined,
    situacaoJuridicaId: dto.situacaoJuridicaId ?? undefined,
    municipioId: dto.municipioId ?? undefined,
    distritoId: (dto as any).distritoId ?? undefined,
    numero: (dto as any).numero ?? '',
    denominacaoImovel: (dto as any).denominacaoImovel ?? '',
    area: dto.area ?? undefined,

    familiasResidentes: dto.familiasResidentes ?? 0,
    pessoasResidentes: dto.pessoasResidentes ?? 0,
    trabalhadoresComCarteira: dto.trabalhadoresComCarteira ?? 0,
    trabalhadoresSemCarteira: dto.trabalhadoresSemCarteira ?? 0,
    maoDeObraFamiliar: dto.maoDeObraFamiliar ?? 0,

    valorTotal: dto.valorTotal ?? 0,
    valorDasBenfeitorias: dto.valorDasBenfeitorias ?? 0,
    valorOutrasAtividades: dto.valorOutrasAtividades ?? 0,
    valorTerraNua: dto.valorTerraNua ?? 0,
    areaIrrigada: dto.areaIrrigada ?? 0,

    litigio: dto.litigio ?? undefined,
    entregouMemorialPlanilha: dto.entregouMemorialPlanilha ?? false,
    destinacaoDoImovel: dto.destinacaoDoImovel ?? undefined,
    pontoDeReferencia: dto.pontoDeReferencia ?? undefined,
    numeroHerdeiros: dto.numeroHerdeiros ?? undefined,
    porcentagemDetencao: dto.porcentagemDetencao ?? undefined,
    obsLitigio: dto.obsLitigio ?? undefined,

    isFonteAguaExterna: dto.isFonteAguaExterna ?? false,
    isPossuiElergiaEletrica: dto.isPossuiElergiaEletrica ?? false,
    isPossuiEnergiaAlternativa: dto.isPossuiEnergiaAlternativa ?? false,
    tipoEnergiaEletrica: dto.tipoEnergiaEletrica ?? undefined,

    isIrrigacao: dto.isIrrigacao ?? false,
    isAcude: dto.isAcude ?? false,
    isAcudePerene: dto.isAcudePerene ?? false,
    usoDaguaAcude: dto.usoDaguaAcude ?? undefined,

    isLagoa: dto.isLagoa ?? false,
    isLagoaPerene: dto.isLagoaPerene ?? false,
    usoDaguaLagoa: dto.usoDaguaLagoa ?? undefined,

    isPoco: dto.isPoco ?? false,
    isPocoPerene: dto.isPocoPerene ?? false,
    usoDaguaPoco: dto.usoDaguaPoco ?? undefined,

    isRioOuRiacho: dto.isRioOuRiacho ?? false,
    isRioOuRiachoPerene: dto.isRioOuRiachoPerene ?? false,
    usoDaguaRioOuRiacho: dto.usoDaguaRioOuRiacho ?? undefined,

    isOlhoDagua: dto.isOlhoDagua ?? false,
    isOlhoDaguaPerene: dto.isOlhoDaguaPerene ?? false,
    usoDaguaOlhoDagua: dto.usoDaguaOlhoDagua ?? undefined,

    isRedeDeAbastecimento: dto.isRedeDeAbastecimento ?? false,

    // Extras do seu form:
    situacaoSelecionada: dto.situacaoJuridicaId ?? undefined,
    formaObtencaoSelecionada: (dto as any).formaObtencaoSelecionada ?? undefined,
    dataPosse: (dto as any).dataPosse ?? undefined,
    areaPosse: (dto as any).areaPosse ?? undefined,
    livro: (dto as any).livro ?? '',
    areaRegistrada: (dto as any).areaRegistrada ?? '',
    nomeCartorio: (dto as any).nomeCartorio ?? '',
    municipioCartorio: (dto as any).municipioCartorio ?? '',
    dataRegistro: (dto as any).dataRegistro ?? undefined,
    oficio: (dto as any).oficio ?? '',
    matricula: (dto as any).matricula ?? '',
    numeroRegistro: (dto as any).numeroRegistro ?? '',
    codImoReceita: (dto as any).codImoReceita ?? '',
    comunidade: (dto as any).comunidade ?? '',
    localidade: (dto as any).localidade ?? '',
    sncr: (dto as any).sncr ?? '',
  };
}
