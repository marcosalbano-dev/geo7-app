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
  { value: 17, viewValue: '17 - Usofruto' },
  { value: 18, viewValue: '18 - Doação em Pagamento' },
  { value: 19, viewValue: '19 - Desapropiação' },
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

  console.log('[EstruturaMapper] 🔍 Mapeando formulário para DTO:');
  console.log('[EstruturaMapper] 🔍 - indicacaoLocalizacao no form:', raw.indicacaoLocalizacao);
  console.log('[EstruturaMapper] 🔍 - pontoDeReferencia no form:', raw.pontoDeReferencia);
  console.log('[EstruturaMapper] 🔍 - localidade no form:', raw.localidade);
  console.log('[EstruturaMapper] 🔍 - comunidade no form:', raw.comunidade);

  return {
    // Identificadores principais
    id: safeNumber(raw.id)!,
    loteId: safeNumber(raw.loteId)!,

    // Situação Jurídica e Forma de Obtenção
    situacaoSelecionada: getValueOrNull(raw.situacaoSelecionada) ?? safeNumber(raw.situacaoSelecionada),
    situacaoJuridicaId: getValueOrNull(raw.situacaoJuridicaId) ?? safeNumber(raw.situacaoJuridicaId),
    formaObtencaoSelecionada: getValueOrNull(raw.formaObtencaoSelecionada) ?? safeNumber(raw.formaObtencaoSelecionada),
    formaObtencaoId: getValueOrNull(raw.formaObtencaoId) ?? safeNumber(raw.formaObtencaoId),
    descricaoFormaDeObtencao: raw.descricaoFormaDeObtencao || descricaoByCodigoForma(raw.formaObtencaoId) || '',
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

    // Campos de localização
    localidade: safeString(raw.localidade),
    comunidade: safeString(raw.comunidade),
    pontoDeReferencia: safeString(raw.pontoDeReferencia), 
    codImoReceita: safeString(raw.codImoReceita),

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

  const dto = {
    // Identificadores principais
    id: safeNumber(raw.id)!,
    loteId: safeNumber(raw.loteId)!,

    // Situação Jurídica e Forma de Obtenção
    situacaoSelecionada: getValueOrNull(raw.situacaoSelecionada) ?? safeNumber(raw.situacaoSelecionada),
    situacaoJuridicaId: getValueOrNull(raw.situacaoJuridicaId) ?? safeNumber(raw.situacaoJuridicaId),
    formaObtencaoSelecionada: getValueOrNull(raw.formaObtencaoSelecionada) ?? safeNumber(raw.formaObtencaoSelecionada),
    formaObtencaoId: getValueOrNull(raw.formaObtencaoId) ?? safeNumber(raw.formaObtencaoId),
    descricaoFormaDeObtencao: raw.descricaoFormaDeObtencao || descricaoByCodigoForma(raw.formaObtencaoId) || '',
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

    // Campos de localização
    localidade: safeString(raw.localidade),
    comunidade: safeString(raw.comunidade),
    indicacaoLocalizacao: safeString(raw.indicacaoLocalizacao),
    pontoDeReferencia: safeString(raw.pontoDeReferencia),
    codImoReceita: safeString(raw.codImoReceita),

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

  console.log('[EstruturaMapper] 🔍 DTO final mapeado:');
  console.log('[EstruturaMapper] 🔍 - indicacaoLocalizacao:', dto.indicacaoLocalizacao);
  console.log('[EstruturaMapper] 🔍 - pontoDeReferencia:', (dto as any).pontoDeReferencia);
  console.log('[EstruturaMapper] 🔍 - localidade:', dto.localidade);
  console.log('[EstruturaMapper] 🔍 - comunidade:', dto.comunidade);

  return dto;
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

// tenta achar a descrição na lista pelo código retornado do back
function descricaoByCodigoForma(codigo?: number): string | null {
  if (!codigo) return null;
  const hit = obtencoes.find(o => o.value === codigo);
  if (hit) return hit.viewValue;
  
  // Se não encontrou, retorna uma descrição genérica
  console.warn('[EstruturaMapper] ⚠️ Código de forma de obtenção não encontrado:', codigo);
  return `Código ${codigo} - Forma de Obtenção não identificada`;
}

export function estruturaDTOToFormValue(
  dto: Partial<EstruturaDTO>
) {
  // ✅ CORREÇÃO: Mapeia pela descrição OU pelo ID se a descrição estiver vazia
  let descricaoForma = dto.descricaoFormaDeObtencao ?? '';
  let codigoForma = codigoFormaByDescricao(descricaoForma);
  
  // Se a descrição está vazia, mantém o campo vazio para seleção manual
  if (!descricaoForma && dto.formaObtencaoId) {
    console.log('[EstruturaMapper] 🔧 Descrição vazia, mas ID da tabela existe:', dto.formaObtencaoId);
    console.log('[EstruturaMapper] 🔧 Mantendo campo vazio para seleção manual (ID da tabela não corresponde ao código do formulário)');
    codigoForma = null; // Mantém vazio para seleção manual
  }
  
  console.log('[EstruturaMapper] 🔍 Mapeamento forma de obtenção da estrutura:');
  console.log('[EstruturaMapper] 🔍 - descricaoFormaDeObtencao original:', dto.descricaoFormaDeObtencao);
  console.log('[EstruturaMapper] 🔍 - formaObtencaoId original:', dto.formaObtencaoId);
  console.log('[EstruturaMapper] 🔍 - codigoForma mapeado pela descrição:', codigoFormaByDescricao(descricaoForma));
  console.log('[EstruturaMapper] 🔍 - codigoForma final:', codigoForma);
  
  console.log('[EstruturaMapper] 🔍 - Resultado final da estrutura:');
  console.log('[EstruturaMapper] 🔍 - codigoForma:', codigoForma);
  console.log('[EstruturaMapper] 🔍 - descricaoForma:', descricaoForma);
  console.log('[EstruturaMapper] 🔍 - areaMedida original:', dto.areaMedida, 'tipo:', typeof dto.areaMedida);
  console.log('[EstruturaMapper] 🔍 - dataPosse original:', dto.dataPosse, 'tipo:', typeof dto.dataPosse);
  
  const formValue = {
    // Identificadores principais
    id: dto.id,
    loteId: dto.loteId,

    // Situação Jurídica e Forma de Obtenção
    situacaoSelecionada: dto.situacaoSelecionada ?? null,
    situacaoJuridicaId: dto.situacaoJuridicaId, // Preservar o valor original
    formaObtencaoSelecionada: dto.formaObtencaoSelecionada ?? null,
    formaObtencaoId: codigoForma,
    descricaoFormaDeObtencao: descricaoForma,

    // Forma de obtenção — campos dinâmicos
    dataPosse: dto.dataPosse ? new Date(dto.dataPosse) : null,
    areaPosse: dto.areaMedida && dto.areaMedida !== null && dto.areaMedida !== '' && dto.areaMedida !== '0' && dto.areaMedida !== '0.0000' ? Number(dto.areaMedida) : null,
    areaMedida: dto.areaMedida && dto.areaMedida !== null && dto.areaMedida !== '' && dto.areaMedida !== '0' && dto.areaMedida !== '0.0000' ? dto.areaMedida : null,
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

    // Campos de localização (ADICIONADOS)
    localidade: dto.localidade ?? '',
    comunidade: dto.comunidade ?? '',
    pontoDeReferencia: dto.pontoDeReferencia ?? '', 
    codImoReceita: dto.codImoReceita ?? '',

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

  console.log('[EstruturaMapper] 🔍 Valores mapeados para areaPosse e dataPosse:');
  console.log('[EstruturaMapper] 🔍 - areaPosse mapeado:', formValue.areaPosse);
  console.log('[EstruturaMapper] 🔍 - dataPosse mapeado:', formValue.dataPosse);
  console.log('[EstruturaMapper] 🔍 - Verificação detalhada areaMedida:');
  console.log('[EstruturaMapper] 🔍   - dto.areaMedida:', dto.areaMedida);
  console.log('[EstruturaMapper] 🔍   - dto.areaMedida !== null:', dto.areaMedida !== null);
  console.log('[EstruturaMapper] 🔍   - dto.areaMedida !== "":', dto.areaMedida !== '');
  console.log('[EstruturaMapper] 🔍   - dto.areaMedida !== "0":', dto.areaMedida !== '0');
  console.log('[EstruturaMapper] 🔍   - dto.areaMedida !== "0.0000":', dto.areaMedida !== '0.0000');
  
  return formValue;
}
