import { FormGroup } from '@angular/forms';
import { EstruturaDTO } from '../models/estrutura-dto';

const obtencoes = [
  { value: 1, viewValue: '01 - Aquisição do Governo Estadual' },
  { value: 2, viewValue: '02 - Adjudicação' },
  { value: 3, viewValue: '03 - Aquisição do Governo Federal' },
  { value: 4, viewValue: '04 - Aquisição INCRA' },
  { value: 5, viewValue: '05 - Aquisição do Governo Municipal' },
  { value: 6, viewValue: '06 - Carta de Arrematação' },
  { value: 7, viewValue: '07 - Compra e Venda de Particular' },
  { value: 8, viewValue: '08 - Concessão de Uso/Governo Estadual' },
  { value: 9, viewValue: '09 - Concessão de Uso/Governo Federal' },
  { value: 10, viewValue: '10 - Concessão de Uso/INCRA' },
  { value: 11, viewValue: '11 - Concessão de Uso/Municipal' },
  { value: 12, viewValue: '12 - Doação' },
  { value: 13, viewValue: '13 - Foro ou Enfiteuse' },
  { value: 14, viewValue: '14 - Incorporação' },
  { value: 15, viewValue: '15 - Recebimento de Herança' },
  { value: 16, viewValue: '16 - Usucapião' },
  { value: 17, viewValue: '17 - Usufruto' },
  { value: 18, viewValue: '18 - Doação em Pagamento' },
  { value: 19, viewValue: '19 - Desapropriação' },
  { value: 20, viewValue: '20 - Outras' }
];

function toISODateString(date: any): string | undefined {
  if (!date) return undefined;
  // Se já vier no formato ISO yyyy-MM-dd, retorna
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}/.test(date)) return date;
  // Se for Date, retorna yyyy-MM-dd
  const d = new Date(date);
  if (isNaN(d.getTime())) return undefined;
  // Corrige para fuso local (Brasil)
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0];
}



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

// Função utilitária segura para selects
function getValueOrNull(field: any): any {
  if (field === null || field === undefined) return undefined;
  return typeof field === 'object' && field !== null && 'value' in field ? field.value : field;
}

export function mapFormToEstruturaDTO(form: FormGroup): EstruturaDTO {
  const raw = form.getRawValue();

  return {
    // Identificadores principais
    id: safeNumber(raw.id)!,
    loteId: safeNumber(raw.loteId)!,

    // Situação Jurídica e Forma de Obtenção
    situacaoSelecionada: getValueOrNull(raw.situacaoSelecionada) ?? safeNumber(raw.situacaoSelecionada),
    situacaoJuridicaId: getValueOrNull(raw.situacaoJuridicaId) ?? safeNumber(raw.situacaoJuridicaId),
    formaObtencaoSelecionada: getValueOrNull(raw.formaObtencaoSelecionada) ?? safeNumber(raw.formaObtencaoSelecionada),
    formaObtencaoId: getValueOrNull(raw.formaObtencaoId) ?? safeNumber(raw.formaObtencaoId),
    descricaoFormaDeObtencao:
      getValueOrNull(raw.descricaoFormaDeObtencao)
      || (obtencoes.find(o => o.value === raw.formaObtencaoId)?.viewValue),
    // Forma de obtenção — campos dinâmicos por situação
    dataPosse: toISODateString(raw.dataPosse),
    areaMedida: safeString(raw.areaPosse ?? raw.areaMedida), // << garante envio
    livro: safeString(raw.livro),
    areaRegistrada: safeString(raw.areaRegistrada),
    nomeCartorio: safeString(raw.nomeCartorio),
    municipioCartorio: safeString(raw.municipioCartorio),
    dataRegistro: toISODateString(raw.dataRegistro),
    oficio: safeString(raw.oficio),
    matricula: safeString(raw.matricula),
    numeroRegistro: safeString(raw.numeroRegistro),
    numeroHerdeiros: safeNumber(raw.numeroHerdeiros), // se usar campo separado

    // Dados principais do lote/estrutura
    numero: safeString(raw.numero),
    denominacaoImovel: safeString(raw.denominacaoImovel),
    municipioId: safeNumber(raw.municipioId)!,
    distritoId: safeNumber(raw.distritoId),
    area: safeNumber(raw.area)!,
    sncr: safeString(raw.sncr),

    // Dados socioeconômicos
    familiasResidentes: safeNumber(raw.familiasResidentes),
    pessoasResidentes: safeNumber(raw.pessoasResidentes),
    trabalhadoresComCarteira: safeNumber(raw.trabalhadoresComCarteira),
    trabalhadoresSemCarteira: safeNumber(raw.trabalhadoresSemCarteira),
    maoDeObraFamiliar: safeNumber(raw.maoDeObraFamiliar),

    // Valores do imóvel
    valorTotal: safeNumber(raw.valorTotal),
    valorDasBenfeitorias: safeNumber(raw.valorDasBenfeitorias),
    valorOutrasAtividades: safeNumber(raw.valorOutrasAtividades),
    valorTerraNua: safeNumber(raw.valorTerraNua),
    areaIrrigada: safeNumber(raw.areaIrrigada),

    // Outros campos
    litigio: getValueOrNull(raw.litigio),
    entregouMemorialPlanilha: safeBoolean(raw.entregouMemorialPlanilha),
    destinacaoDoImovel: getValueOrNull(raw.destinacaoDoImovel),
    porcentagemDetencao: safeNumber(raw.porcentagemDetencao),
    obsLitigio: safeString(raw.obsLitigio),

    // Energia e água
    isFonteAguaExterna: safeBoolean(raw.isFonteAguaExterna),
    isPossuiElergiaEletrica: safeBoolean(raw.isPossuiElergiaEletrica),
    isPossuiEnergiaAlternativa: safeBoolean(raw.isPossuiEnergiaAlternativa),
    tipoEnergiaEletrica: getValueOrNull(raw.tipoEnergiaEletrica),

    // Recursos hídricos
    isIrrigacao: safeBoolean(raw.isIrrigacao),
    isAcude: safeBoolean(raw.isAcude),
    isAcudePerene: safeBoolean(raw.isAcudePerene),
    usoDaguaAcude: getValueOrNull(raw.usoDaguaAcude),
    isLagoa: safeBoolean(raw.isLagoa),
    isLagoaPerene: safeBoolean(raw.isLagoaPerene),
    usoDaguaLagoa: getValueOrNull(raw.usoDaguaLagoa),
    isPoco: safeBoolean(raw.isPoco),
    isPocoPerene: safeBoolean(raw.isPocoPerene),
    usoDaguaPoco: getValueOrNull(raw.usoDaguaPoco),
    isRioOuRiacho: safeBoolean(raw.isRioOuRiacho),
    isRioOuRiachoPerene: safeBoolean(raw.isRioOuRiachoPerene),
    usoDaguaRioOuRiacho: getValueOrNull(raw.usoDaguaRioOuRiacho),
    isOlhoDagua: safeBoolean(raw.isOlhoDagua),
    isOlhoDaguaPerene: safeBoolean(raw.isOlhoDaguaPerene),
    usoDaguaOlhoDagua: getValueOrNull(raw.usoDaguaOlhoDagua),

    isRedeDeAbastecimento: safeBoolean(raw.isRedeDeAbastecimento),
    ativo: safeBoolean(raw.ativo),
    dhc: raw.dhc ? new Date(raw.dhc) : undefined,
    dhm: raw.dhm ? new Date(raw.dhm) : undefined,
  };
}

// tenta achar o código na lista pelo texto retornado do back
function codigoFormaByDescricao(desc?: string): number | null {
  if (!desc) return null;
  const hit = obtencoes.find(o => o.viewValue === desc);
  if (hit) return hit.value;

  // fallback: se a descrição começar com "NN -", extrai o número
  const m = desc.match(/^\s*(\d{1,2})\s*-/);
  return m ? Number(m[1]) : null;
}

export function estruturaDTOToFormValue(
  dto: Partial<EstruturaDTO>
) {
  const codigoForma = codigoFormaByDescricao(dto.descricaoFormaDeObtencao);
  return {
    // Identificadores principais
    id: dto.id,
    loteId: dto.loteId,

    // Situação Jurídica e Forma de Obtenção
    situacaoSelecionada: dto.situacaoSelecionada ?? null,
    situacaoJuridicaId: dto.situacaoJuridicaId ?? null,
    formaObtencaoSelecionada: dto.formaObtencaoSelecionada ?? null,
    formaObtencaoId: codigoForma,
    descricaoFormaDeObtencao: codigoForma,

    // Forma de obtenção — campos dinâmicos
    dataPosse: dto.dataPosse ?? null,
    areaPosse: dto.areaMedida ? Number(dto.areaMedida) : null,
    livro: dto.livro ?? '',
    areaRegistrada: dto.areaRegistrada ?? '',
    nomeCartorio: dto.nomeCartorio ?? '',
    municipioCartorio: dto.municipioCartorio ?? '',
    dataRegistro: dto.dataRegistro ?? null,
    oficio: dto.oficio ?? '',
    matricula: dto.matricula ?? '',
    numeroRegistro: dto.numeroRegistro ?? '',

    // Dados principais do lote/estrutura
    numero: dto.numero ?? '',
    denominacaoImovel: dto.denominacaoImovel ?? '',
    municipioId: dto.municipioId ?? null,
    distritoId: dto.distritoId ?? null,
    area: dto.area ?? null,
    sncr: dto.sncr ?? '',

    // Dados socioeconômicos
    familiasResidentes: dto.familiasResidentes ?? 0,
    pessoasResidentes: dto.pessoasResidentes ?? 0,
    trabalhadoresComCarteira: dto.trabalhadoresComCarteira ?? 0,
    trabalhadoresSemCarteira: dto.trabalhadoresSemCarteira ?? 0,
    maoDeObraFamiliar: dto.maoDeObraFamiliar ?? 0,

    // Valores do imóvel
    valorTotal: dto.valorTotal ?? 0,
    valorDasBenfeitorias: dto.valorDasBenfeitorias ?? 0,
    valorOutrasAtividades: dto.valorOutrasAtividades ?? 0,
    valorTerraNua: dto.valorTerraNua ?? 0,
    areaIrrigada: dto.areaIrrigada ?? 0,

    // Outros campos
    litigio: dto.litigio ?? null,
    entregouMemorialPlanilha: dto.entregouMemorialPlanilha ?? false,
    destinacaoDoImovel: dto.destinacaoDoImovel ?? null,
    numeroHerdeiros: dto.numeroHerdeiros ?? null,
    porcentagemDetencao: dto.porcentagemDetencao ?? null,
    obsLitigio: dto.obsLitigio ?? null,

    // Energia e água
    isFonteAguaExterna: dto.isFonteAguaExterna ?? false,
    isPossuiElergiaEletrica: dto.isPossuiElergiaEletrica ?? false,
    isPossuiEnergiaAlternativa: dto.isPossuiEnergiaAlternativa ?? false,
    tipoEnergiaEletrica: dto.tipoEnergiaEletrica ?? null,

    // Recursos hídricos
    isIrrigacao: dto.isIrrigacao ?? false,
    isAcude: dto.isAcude ?? false,
    isAcudePerene: dto.isAcudePerene ?? false,
    usoDaguaAcude: dto.usoDaguaAcude ?? null,
    isLagoa: dto.isLagoa ?? false,
    isLagoaPerene: dto.isLagoaPerene ?? false,
    usoDaguaLagoa: dto.usoDaguaLagoa ?? null,
    isPoco: dto.isPoco ?? false,
    isPocoPerene: dto.isPocoPerene ?? false,
    usoDaguaPoco: dto.usoDaguaPoco ?? null,
    isRioOuRiacho: dto.isRioOuRiacho ?? false,
    isRioOuRiachoPerene: dto.isRioOuRiachoPerene ?? false,
    usoDaguaRioOuRiacho: dto.usoDaguaRioOuRiacho ?? null,
    isOlhoDagua: dto.isOlhoDagua ?? false,
    isOlhoDaguaPerene: dto.isOlhoDaguaPerene ?? false,
    usoDaguaOlhoDagua: dto.usoDaguaOlhoDagua ?? null,

    isRedeDeAbastecimento: dto.isRedeDeAbastecimento ?? false,
    ativo: dto.ativo ?? null,
    dhc: dto.dhc ?? null,
    dhm: dto.dhm ?? null,
  };
}
