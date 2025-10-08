// src/app/exportacao-dp/exportacao-dp.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom, forkJoin } from 'rxjs';
import { saveAs } from 'file-saver';
import { environment } from '../../environments/environment';
import { CategoriaService, Categoria } from '../services/categoria.service';
import { CulturaService, Cultura } from '../services/cultura.service';
import { ConjugePessoaService } from '../services/conjuge-pessoa.service';
import { AuthService } from '../services/auth.service';

/**
 * ===== Tipos alinhados com os DTOs do Java =====
 * O endpoint deve devolver este agregado "Geo7MunicipioExportDTO".
 */

export interface MunicipioDTO {
  id: number; nome: string; uf: string;
}

export interface LoteDTO {
  id: number;
  proprietario: string | null;
  area: number | null;
  denominacaoImovel: string | null;
  numero: string | null;
  dhc?: string | null;
  dhm?: string | null;
  perimetro?: number | null;
  sncr?: string | null;
  cpf?: string | null;
  municipioId: number | null;
  municipioNome: string | null;
  situacaoJuridicaId?: number | null;
  distritoId?: number | null;
  distritoNome?: string | null;
  situacaoJuridicaNome?: string | null;
  dataTerminoPeriodoDeUso?: string | null;
}

export interface EnderecoLoteDTO {
  id: number;
  loteId: number;
  ativo?: boolean | null;
  dhc?: string | null;
  dhm?: string | null;
  pontoDeReferencia?: string | null;
  codImoReceita?: string | null;
  areaUrbana?: string | number | null;
  distritoId?: number | null;
  comunidade?: string | null;
  localidade?: string | null;
}

export interface FormaObtencaoDTO {
  id?: number | null;
  descricaoFormaDeObtencao?: string | null;
  oficio?: string | null;
  matricula?: string | null;
  livro?: string | null;
  nomeCartorio?: string | null;
  dataRegistro?: string | null; // yyyy-MM-dd ou yyyy-MM-ddTHH:mm:ss
  numeroRegistro?: string | null;
  areaRegistrada?: string | number | null;
  areaMedida?: string | number | null;
  municipioCartorio?: string | null;
  numeroHerdeiros?: number | null;
  dataPosse?: string | null;
  loteId?: number | null;
  situacaoJuridicaId?: number | null;
}

export interface EstruturaDTO {
  id: number;
  loteId: number;

  familiasResidentes?: number | null;
  pessoasResidentes?: number | null;
  trabalhadoresComCarteira?: number | null;
  trabalhadoresSemCarteira?: number | null;
  maoDeObraFamiliar?: number | null;

  valorTotal?: number | null;
  valorDasBenfeitorias?: number | null;
  valorOutrasAtividades?: number | null;
  valorTerraNua?: number | null;

  areaIrrigada?: number | null;
  litigio?: string | null;
  entregouMemorialPlanilha?: boolean | null;
  destinacaoDoImovel?: string | null;

  numeroHerdeiros?: number | null;
  porcentagemDetencao?: number | null;
  obsLitigio?: string | null;
  tipoEnergiaEletrica?: string | null;

  // uso d’água (strings)
  usoDaguaRioOuRiacho?: string | null;
  usoDaguaAcude?: string | null;
  usoDaguaOlhoDagua?: string | null;
  usoDaguaLagoa?: string | null;
  usoDaguaPoco?: string | null;

  // flags d’água/energia
  isRioOuRiacho?: boolean | null;
  isRioOuRiachoPerene?: boolean | null;
  isAcude?: boolean | null;
  isAcudePerene?: boolean | null;
  isOlhoDagua?: boolean | null;
  isOlhoDaguaPerene?: boolean | null;
  isLagoa?: boolean | null;
  isLagoaPerene?: boolean | null;
  isPoco?: boolean | null;
  isPocoPerene?: boolean | null;

  isFonteAguaExterna?: boolean | null;
  isIrrigacao?: boolean | null;
  isPossuiElergiaEletrica?: boolean | null; // sic (nome vem assim do back)
  isPossuiEnergiaAlternativa?: boolean | null;
  isRedeDeAbastecimento?: boolean | null;

  // forma agregada (quando o back já manda “apontado”)
  descricaoFormaDeObtencao?: string | null;
  dataPosse?: string | null;
  areaMedida?: string | null;
  numeroHerdeirosForma?: number | null;

  situacaoJuridicaId?: number | null;

  // campos do lote agregados pelo DTO (se vierem)
  numero?: string | null;
  sncr?: string | null;
  denominacaoImovel?: string | null;
  area?: number | null;
  municipioNome?: string | null;
  municipioId?: number | null;
  distritoId?: number | null;
}

export interface EnderecoPessoaDTO {
  id: number;
  logradouro?: string | null;
  complemento?: string | null;
  numero?: string | null;
  bairro?: string | null;
  cep?: string | null;
  codigoPaisResidencia?: string | null;
  municipioId?: number | null;
  municipioNome?: string | null;
  uf?: string | null;
  pessoaId?: number | null;
}

export interface DocumentoPessoaDTO {
  id: number;
  pessoaId?: number | null;
  tipoDocumentoIdentificacao?: string | null;
  numeroDocumentoIdentificacao?: string | null;
  orgaoEmissor?: string | null;
  ufOrgaoEmissor?: string | null;
  tipoNacionalidade?: string | null;
  cpf?: string | null;
  codigoPaisOrigem?: string | null;
  estadoCivil?: string | null;
  tipoPessoa?: string | null;
  cnpj?: string | null;
  naturezaJuridica?: string | null;
  capitalNacional?: number | null;
  capitalEstrangeiro?: number | null;
  registroJuntaComercial?: string | null;
  nomeFantasia?: string | null;
  codigoPaisSede?: string | null;
  ufPaisSede?: string | null;
  tipoDocumentoRepresentanteLegal?: string | null;
  numeroDocumentoRepresentanteLegal?: string | null;
  codigoPaisResidencia?: string | null;
  tipoDePoder?: string | null;
  tipoDeGoverno?: string | null;
  percentCapitalNacional?: string | null;
  percentCapitalEstrangeiro?: string | null;
  pcePais?: string | null;
  pcePercentCapital?: string | null;
  obsevacoesQuadro7?: string | null;
  naturalidadeId?: number | null;
}

export interface PessoaDTO {
  id: number;
  nome: string;

  telefone?: string | null;
  fax?: string | null;
  ramal?: string | null;
  email?: string | null;

  nomePai?: string | null;
  nomeMae?: string | null;
  dataNascimento?: string | null; // yyyy-MM-dd
  sexoPessoa?: string | null;
  isEspolio?: boolean | null;

  codigoPessoaIncra?: string | null;
  coordenadaEste?: string | null;
  coordenadaNorte?: string | null;
  atividadePrincipal?: string | null;

  regimeDeBens?: string | null;
  dataCasamento?: string | null;

  isRecebePronaf?: boolean | null;
  isRecebeAjudoProgramaGoverno?: boolean | null;
  qtdPronaf?: number | null;
  valorTotalPronafs?: number | null;

  racaCor?: string | null;
}

export interface PessoaLoteDTO {
  id: number;
  pessoaId: number;
  loteId: number;

  codigoImovelRural?: string | null;
  condicaoPessoaImovelRural?: string | null;
  percentDetencao?: number | null;
  isDeclarante?: boolean | null;
  isResideNoImovel?: boolean | null;

  tipoDoAto?: string | null;
  numeroAto?: number | null;
  dataAto?: string | null; // yyyy-MM-dd
  quantidadeAreaCedida?: number | null;
  atividadePrincipalExploracao?: string | null;
  contrato?: string | null;
  dataTerminoContrato?: string | null; // yyyy-MM-dd
  isContratoPrazoIndeterminado?: boolean | null;
}

export interface ConjugePessoaDTO {
  id?: number;
  nome: string;
  telefone?: string;
  email?: string;
  nomePai?: string;
  nomeMae?: string;
  dataNascimento?: string; // yyyy-MM-dd format
  sexoPessoa?: string;
  
  // Endereço
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cep?: string;
  
  // Códigos de país
  codigoPaisResidencia?: string;
  codigoPaisOrigem?: string;
  
  // Documentação
  tipoDocumentoIdentificacao?: string;
  descricaoOutroDocumentoIdentificacao?: string;
  numeroDocumentoIdentificacao?: string;
  orgaoEmissor?: string;
  ufOrgaoEmissor?: string;
  tipoNacionalidade?: string;
  cpf: string;
  racaCor?: string;
  conjugeOk?: boolean;
  validadeRne?: string; // yyyy-MM-dd format
  
  // Relacionamentos
  pessoaId: number;
  municipioResidenciaId?: number;
  municipioNaturalidadeId?: number;
  
  // Derivados (calculados no backend)
  uf?: string;
  ufNaturalidade?: string;
}

export interface ItemDTO {
  id: number;
  loteId: number;

  // vegetal
  categoriaId?: number | null;
  culturaId?: number | null;
  formaExploracao?: string | null; // "CONSORCIO"/"ROTACAO"/"ISOLADO" (ou nulo)
  sequenciaProdutoVegetal?: number | null;
  areaColhida?: number | null;
  areaPlantada?: number | null;
  quantidadeColhida?: number | null;
  unidadeProducaoId?: number | null;
  codigoUnidadeProducao?: string | null;
  indicadorGeralDeRestricao?: string | number | null;

  // granjeira
  granjeiraAgricolaId?: number | null;
  areaExploradaGranjeiraAgricola?: number | null;

  // outros usos
  areaComOutroUsoId?: number | null;
  areaUtilizada?: number | null;

  // restrições
  areasRestricoesId?: number | null;
  areaUtilizadaRestricao?: number | null;

  // pastagem
  tipoPastagem?: string | number | null;
  areaPastagem?: number | null;

  // pecuária
  categoriaAnimalId?: number | null;
  quantidadeAnimal?: number | null;

  // sem uso
  areaAproveitavelNaoUtilizada?: number | null;

  areaGeralItem?: number | null;
  dadosSobreUsoId?: number | null;
}

export interface DadosSobreUsoDTO {
  id: number;
  loteId: number;
  areaTotalIsolado?: number | null;
  areaTotalConsorcio?: number | null;
  areaTotalRotacao?: number | null;
  items: ItemDTO[];
}

/** Payload do endpoint geo7 de exportação por município */
export interface Geo7PessoaAgregada {
  pessoa: PessoaDTO;
  pessoaLote: PessoaLoteDTO;
  endereco?: EnderecoPessoaDTO;
  documento?: DocumentoPessoaDTO;
  conjuge?: ConjugePessoaDTO;
}

export interface Geo7LoteAgregado {
  lote: LoteDTO;
  enderecoLote?: EnderecoLoteDTO;
  estrutura?: EstruturaDTO;
  formas?: FormaObtencaoDTO[];    // opcional: pode vir vazio se já vier “apontado” em EstruturaDTO
  dadosSobreUso?: DadosSobreUsoDTO;
  pessoas?: Geo7PessoaAgregada[];
}

export interface Geo7MunicipioExportDTO {
  municipio: MunicipioDTO;
  // se o back enviar codIbge, inclua no municipio
  lotes: Geo7LoteAgregado[];
}

@Injectable({ providedIn: 'root' })
export class ExportacaoDpService {

  private apiUrl = `${environment.apiUrl}/exportacao-dp`;

  constructor(
    private http: HttpClient,
    private categoriaService: CategoriaService,
    private culturaService: CulturaService,
    private conjugeService: ConjugePessoaService,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const authHeaders = this.authService.getAuthHeaders();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...authHeaders
    });
  }

  async exportarMunicipioXml(municipioId: number): Promise<void> {
    // Carrega os dados do município, categorias e culturas em paralelo
    const { dto, categorias, culturas } = await lastValueFrom(forkJoin({
      dto: this.http.get<Geo7MunicipioExportDTO>(`${this.apiUrl}/municipio/${municipioId}`, {
        headers: this.getHeaders()
      }),
      categorias: this.categoriaService.listarTodas(),
      culturas: this.culturaService.listarTodas()
    }));
    
    // Carrega os dados do cônjuge para todas as pessoas
    await this.carregarDadosConjuge(dto);
    
    const xml = this.buildMunicipioXml(dto, categorias, culturas);
    const blob = new Blob([xml], { type: 'text/xml;charset=utf-8' });
    const nome = (dto?.municipio?.nome || `municipio-${municipioId}`).replace(/\s+/g, '_').toUpperCase();
    saveAs(blob, `${nome}.xml`);
  }

  async exportarLotesXml(municipioId: number, loteIds: number[]): Promise<void> {
    if (!loteIds || loteIds.length === 0) {
      throw new Error('Nenhum lote selecionado para exportação');
    }

    // Carrega os dados do município, categorias e culturas em paralelo
    const { dto, categorias, culturas } = await lastValueFrom(forkJoin({
      dto: this.http.get<Geo7MunicipioExportDTO>(`${this.apiUrl}/municipio/${municipioId}`, {
        headers: this.getHeaders()
      }),
      categorias: this.categoriaService.listarTodas(),
      culturas: this.culturaService.listarTodas()
    }));
    
    // Filtra apenas os lotes selecionados
    const dtoFiltrado = this.filtrarLotesSelecionados(dto, loteIds);
    
    // Carrega os dados do cônjuge para todas as pessoas dos lotes selecionados
    await this.carregarDadosConjuge(dtoFiltrado);
    
    const xml = this.buildMunicipioXml(dtoFiltrado, categorias, culturas);
    const blob = new Blob([xml], { type: 'text/xml;charset=utf-8' });
    const nome = (dto?.municipio?.nome || `municipio-${municipioId}`).replace(/\s+/g, '_').toUpperCase();
    saveAs(blob, `${nome}_LOTES_SELECIONADOS_${loteIds.length}.xml`);
  }

  // --------------------------
  // Filtragem de lotes selecionados
  // --------------------------

  private filtrarLotesSelecionados(dto: Geo7MunicipioExportDTO, loteIds: number[]): Geo7MunicipioExportDTO {
    const lotesFiltrados = dto.lotes?.filter(lote => 
      lote.lote?.id && loteIds.includes(lote.lote.id)
    ) || [];

    return {
      ...dto,
      lotes: lotesFiltrados
    };
  }

  // --------------------------
  // Carregamento de dados do cônjuge
  // --------------------------

  private async carregarDadosConjuge(dto: Geo7MunicipioExportDTO): Promise<void> {
    if (!dto.lotes) return;

    // Coleta todos os IDs de pessoas únicos
    const pessoaIds = new Set<number>();
    dto.lotes.forEach(lote => {
      if (lote.pessoas) {
        lote.pessoas.forEach(pessoa => {
          if (pessoa.pessoa?.id) {
            pessoaIds.add(pessoa.pessoa.id);
          }
        });
      }
    });

    // Busca dados do cônjuge para todas as pessoas em paralelo
    const conjugeRequests = Array.from(pessoaIds).map(pessoaId => 
      this.conjugeService.buscarPorPessoa(pessoaId)
    );

    if (conjugeRequests.length === 0) return;

    try {
      const conjugeResults = await lastValueFrom(forkJoin(conjugeRequests));
      
      // Cria um mapa de pessoaId -> cônjuge
      const conjugeMap = new Map<number, ConjugePessoaDTO>();
      Array.from(pessoaIds).forEach((pessoaId, index) => {
        const conjuges = conjugeResults[index];
        if (conjuges && conjuges.length > 0) {
          conjugeMap.set(pessoaId, conjuges[0]); // Pega o primeiro cônjuge
        }
      });

      // Atribui os dados do cônjuge às pessoas
      dto.lotes.forEach(lote => {
        if (lote.pessoas) {
          lote.pessoas.forEach(pessoa => {
            if (pessoa.pessoa?.id) {
              const conjuge = conjugeMap.get(pessoa.pessoa.id);
              if (conjuge) {
                pessoa.conjuge = conjuge;
              }
            }
          });
        }
      });
    } catch (error) {
      console.error('Erro ao carregar dados do cônjuge:', error);
      // Continua a exportação mesmo se houver erro ao carregar cônjuges
    }
  }

  // --------------------------
  // XML builders (geo7)
  // --------------------------

  private buildMunicipioXml(dto: Geo7MunicipioExportDTO, categorias: Categoria[] = [], culturas: Cultura[] = []): string {
    const header = `<?xml version="1.0" encoding="UTF-8"?>`;
    const openRoot = `<exportacaoDP>`;
    const closeRoot = `</exportacaoDP>`;

    const body =
      `<_declaracoes>` +
      `<imoveis>` +
      (dto.lotes || []).map(l => this.buildLoteXml(dto.municipio, l, categorias, culturas)).join('') +
      `</imoveis>` +
      `</_declaracoes>`;

    return [header, openRoot, body, closeRoot].join('');
  }

  private buildLoteXml(municipio: MunicipioDTO, ag: Geo7LoteAgregado, categorias: Categoria[] = [], culturas: Cultura[] = []): string {
    const numero = this.s(ag.lote?.numero);
    const sncr = this.s(ag.lote?.sncr);
    const cpfLotes = this.s(ag.lote?.cpf);
    const cnpjLotes = ''; // preencha se tiver

    const attrSncr = sncr ? ` sncr="${this.x(sncr)}"` : '';
    const attrCpf = cpfLotes ? ` cpfLotes="${this.x(cpfLotes)}"` : '';
    const attrCnpj = cnpjLotes ? ` cnpjLotes="${this.x(cnpjLotes)}"` : '';

    return (
      `<lotes numeroLote="${this.x(numero)}">` +
        `<imovel numeroLote="${this.x(numero)}"${attrSncr}${attrCpf}${attrCnpj}>` +
          this.buildDeclaracaoEstrutura(ag) +
          this.buildDeclaracaoUso(municipio, ag, categorias, culturas) +
          this.buildDeclaracaoPessoa(ag) +
        `</imovel>` +
      `</lotes>`
    );
  }

  private buildDeclaracaoEstrutura(ag: Geo7LoteAgregado): string {
    const e = ag.estrutura || {} as EstruturaDTO;
    const formas = (ag.formas || []).filter(Boolean);

    const n4 = (v: any) => this.nf(v);
    const sn = (v: any) => this.sn(v);

    return (
      `<declaracaoEstrutura>` +
        this.tag('codigoCadastro', ag.lote?.id ?? 0) +
        this.tag('proprietario', ag.lote?.proprietario) +
        this.tag('areaMedida', n4(e.area ?? ag.lote?.area ?? 0)) +
        this.tag('denominacaoImovelRural', ag.lote?.denominacaoImovel) +
        this.tag('situacaoJuridica', ag.lote?.situacaoJuridicaId ?? 0) +
        this.tag('indicacaoLocalizacao', ag.enderecoLote?.pontoDeReferencia) +
        this.tag('codImoReceita', ag.enderecoLote?.codImoReceita) +
        this.tag('localidade', ag.enderecoLote?.localidade) +
        this.tag('nomeDistrito', ag.lote?.distritoNome) +

        this.tag('familiasResidentes', e.familiasResidentes ?? 0) +
        this.tag('pessoasResidentes', e.pessoasResidentes ?? 0) +
        this.tag('trabalhadoresComCarteira', e.trabalhadoresComCarteira ?? 0) +
        this.tag('trabalhadoresSemCarteira', e.trabalhadoresSemCarteira ?? 0) +
        this.tag('maoObraFamiliar', e.maoDeObraFamiliar ?? 0) +

        this.tag('valorTotal', n4(e.valorTotal)) +
        this.tag('valorBenfeitorias', n4(e.valorDasBenfeitorias)) +
        this.tag('valorOutrasAtividades', n4(e.valorOutrasAtividades)) +
        this.tag('valorTerraNua', n4(e.valorTerraNua)) +

        this.tag('codigoDestinacaoDoImovel', e.destinacaoDoImovel) +
        this.tag('codigoLitigio', e.litigio) +
        this.tag('tipoEnergiaEletrica', e.tipoEnergiaEletrica) +

        this.tag('isIrrigacao', sn(e.isIrrigacao)) +
        this.tag('isPossuiEnergiaEletrica', sn(e.isPossuiElergiaEletrica)) +
        this.tag('isPossuiEnergiaAlternativa', sn(e.isPossuiEnergiaAlternativa)) +
        this.tag('isPossuiFonteDagua', sn(this.hasAlgumaFonte(e))) +
        this.tag('isPossuiFonteDaguaExterna', sn(e.isFonteAguaExterna)) +

        this.tag('numeroHerdeiros', e.numeroHerdeiros ?? 0) +
        this.tag('isAcude', sn(e.isAcude)) +
        this.tag('isAcudePerene', sn(e.isAcudePerene)) +
        this.tag('isLagoa', sn(e.isLagoa)) +
        this.tag('isLagoaPerene', sn(e.isLagoaPerene)) +
        this.tag('isPoco', sn(e.isPoco)) +
        this.tag('isPocoPerene', sn(e.isPocoPerene)) +
        this.tag('isRioOuRiacho', sn(e.isRioOuRiacho)) +
        this.tag('isOlhoDagua', sn(e.isOlhoDagua)) +
        this.tag('isOlhoDaguaPerene', sn(e.isOlhoDaguaPerene)) +
        this.tag('isRedeDeAbastecimento', sn(e.isRedeDeAbastecimento)) +

        // Flags de uso d’água derivados dos campos string (se usados pelo importador)
        this.tag('usoAguaAbastecimentoHumano', sn(this.usosDaguaInclui(e, ['HUMANO', 'ABASTECIMENTO_HUMANO']))) +
        this.tag('usoAguaAplicacaoAgricola', sn(this.usosDaguaInclui(e, ['AGRICOLA', 'APLICACAO_AGRICOLA']))) +
        this.tag('usoAguaHumanoAgricola', sn(this.usosDaguaInclui(e, ['HUMANO_AGRICOLA']))) +
        this.tag('usoAguaAbastecimentoAnimal', sn(this.usosDaguaInclui(e, ['ANIMAL', 'ABASTECIMENTO_ANIMAL']))) +
        this.tag('usoAguaHumanoAnimalAgricola', sn(this.usosDaguaInclui(e, ['HUMANO_ANIMAL_AGRICOLA']))) +
        this.tag('usoAguaHumanoAnimal', sn(this.usosDaguaInclui(e, ['HUMANO_ANIMAL']))) +
        this.tag('usoAguaAnimalAgricola', sn(this.usosDaguaInclui(e, ['ANIMAL_AGRICOLA']))) +
        this.tag('usoAguaSemUso', sn(this.usosDaguaInclui(e, ['SEM_USO', 'NENHUM']))) +

        // Formas de obtenção (repetível)
        (formas || []).map(f =>
          `<formaObtencao>` +
            this.tag('codigoCadastro', ag.lote?.id ?? 0) +
            this.tag('areaFormaObtencaoMedida', this.nf(f.areaMedida)) +
            this.tag('areaFormaObtencaoRegistrada', this.nf(f.areaRegistrada)) +
            this.tag('codFormaObtencao', f.situacaoJuridicaId ?? 0) +
            this.tag('dataPosse', this.iso(f.dataPosse)) +
            this.tag('dataRegistro', this.iso(f.dataRegistro)) +
            this.tag('livro', f.livro) +
            this.tag('matricula', f.matricula) +
            this.tag('nomeCartorio', f.nomeCartorio) +
            this.tag('numeroRegistro', f.numeroRegistro) +
            this.tag('oficio', f.oficio) +
            this.tag('registro', '') +
            this.tag('municipioCartorio', f.municipioCartorio) +
          `</formaObtencao>`
        ).join('') +
      `</declaracaoEstrutura>`
    );
  }

  private buildDeclaracaoUso(municipio: MunicipioDTO, ag: Geo7LoteAgregado, categorias: Categoria[] = [], culturas: Cultura[] = []): string {
    const u = ag.dadosSobreUso || { items: [] as ItemDTO[] };
    const itens = u.items || [];

    // Split por grupo
    const vegetalConsorcio = itens.filter(i => this.isVegetal(i) && this.formaExpl(i) === 6);
    const vegetalRotacao   = itens.filter(i => this.isVegetal(i) && this.formaExpl(i) === 8);
    const vegetalIsolado   = itens.filter(i => this.isVegetal(i) && ![6,8].includes(this.formaExpl(i)));

    const areasGranjeira   = itens.filter(i => i.granjeiraAgricolaId != null);
    const outrosUsos       = itens.filter(i => i.areaComOutroUsoId != null);
    
    // CORREÇÃO: Filtrar apenas itens com área > 0 para evitar repetições desnecessárias
    const restricoes       = itens.filter(i => i.areasRestricoesId != null && i.areaUtilizadaRestricao != null && i.areaUtilizadaRestricao > 0);
    const pastagens        = itens.filter(i => i.tipoPastagem != null && i.tipoPastagem !== '');
    const pecuaria         = itens.filter(i => i.categoriaAnimalId != null);
    const semUso           = itens.filter(i => i.areaAproveitavelNaoUtilizada != null && i.areaAproveitavelNaoUtilizada > 0);

    const n4 = (v: any) => this.nf(v);
    const s  = (v: any) => this.s(v);

    // Busca os IDs das categorias
    const categoriaIdVegetalConsorcio = this.getCategoriaId(categorias, 'PRODUTO_VEGETAL_CONSORCIO_OU_ROTACAO');
    const categoriaIdVegetalIsolado = this.getCategoriaId(categorias, 'PRODUTO_VEGETAL_ISOLADO');
    const categoriaIdAreasOutrosUsos = this.getCategoriaId(categorias, 'AREAS_COM_OUTRO_USO');
    const categoriaIdGranjeiraAgricola = this.getCategoriaId(categorias, 'AREAS_DE_EXPLORACAO_ACRICOLA_OU_GRANJEIRA');
    const categoriaIdAreasComRestricao = this.getCategoriaId(categorias, 'AREAS_COM_RESTRICAO');
    const categoriaIdAreasComPastagem = this.getCategoriaId(categorias, 'AREAS_DE_PASTAGEM');
    const categoriaIdInfoPecuaria = this.getCategoriaId(categorias, 'INFOMACOES_SOBRE_PECUARIA');
    const categoriaIdAreasSemRestricaoSemUso = this.getCategoriaId(categorias, 'AREAS_SEM_RESTICAO_E_SEM_USO');

    const blocoConsorcio = vegetalConsorcio.map(it =>
      `<item>` +
        this.tag('categoriaIdVegetalConsorcio', categoriaIdVegetalConsorcio) +
        this.tag('culturaIdVegetalConsorcio', this.getCodigoCultura(culturas, it.culturaId)) +
        this.tag('formaExploracaoVegetalConsorcio', 6) +
        this.tag('sequenciaProdutoVegetalConsorcio', it.sequenciaProdutoVegetal ?? 0) +
        this.tag('areaPlantadaVegetalConsorcio', n4(it.areaPlantada)) +
        this.tag('areaColhidaVegetalConsorcio', n4(it.areaColhida)) +
        this.tag('quantidadeColhidaVegetalConsorcio', s(it.quantidadeColhida ?? 0)) +
        this.tag('codigoUnidadeExploracaoIdVegetalConsorcio', s(it.codigoUnidadeProducao ?? '')) +
        this.tag('indicadorGeralDeRestricaoVegetalConsorcio', s(it.indicadorGeralDeRestricao ?? 0)) +
      `</item>`
    ).join('');

    const blocoRotacao = vegetalRotacao.map(it =>
      `<item>` +
        this.tag('categoriaIdVegetalRotacao', categoriaIdVegetalConsorcio) +
        this.tag('culturaIdVegetalRotacao', this.getCodigoCultura(culturas, it.culturaId)) +
        this.tag('formaExploracaoVegetalRotacao', 8) +
        this.tag('sequenciaProdutoVegetalRotacao', it.sequenciaProdutoVegetal ?? 0) +
        this.tag('areaPlantadaVegetalRotacao', n4(it.areaPlantada)) +
        this.tag('areaColhidaVegetalRotacao', n4(it.areaColhida)) +
        this.tag('quantidadeColhidaVegetalRotacao', s(it.quantidadeColhida ?? 0)) +
        this.tag('codigoUnidadeExploracaoIdVegetalRotacao', s(it.codigoUnidadeProducao ?? '')) +
        this.tag('indicadorGeralDeRestricaoVegetalRotacao', s(it.indicadorGeralDeRestricao ?? 0)) +
      `</item>`
    ).join('');

    const blocoIsolado = vegetalIsolado.map(it =>
      `<item>` +
        this.tag('categoriaIdVegetalIsolado', categoriaIdVegetalIsolado) +
        this.tag('culturaIdVegetalIsolado', this.getCodigoCultura(culturas, it.culturaId)) +
        this.tag('areaPlantadaVegetalIsolado', n4(it.areaPlantada)) +
        this.tag('areaColhidaVegetalIsolado', n4(it.areaColhida)) +
        this.tag('quantidadeColhidaVegetalIsolado', s(it.quantidadeColhida ?? 0)) +
        this.tag('codigoUnidadeExploracaoIdVegetalIsolado', s(it.codigoUnidadeProducao ?? '')) +
        this.tag('indicadorGeralDeRestricaoVegetalIsolado', s(it.indicadorGeralDeRestricao ?? 0)) +
      `</item>`
    ).join('');

    const blocoGranjeira = areasGranjeira.map(g =>
      `<item>` +
        this.tag('categoriaIdGranjeiraAgricola', categoriaIdGranjeiraAgricola) +
        this.tag('granjeiraAgricolaId', g.granjeiraAgricolaId ?? 0) +
        this.tag('areaExploradaGranjeiraAgricola', n4(g.areaExploradaGranjeiraAgricola)) +
        this.tag('indicadorRestricaoGranjeiraAgricola', s(g.indicadorGeralDeRestricao ?? 0)) +
      `</item>`
    ).join('');

    const blocoOutrosUsos = outrosUsos.map(ou =>
      `<item>` +
        this.tag('categoriaIdAreasOutrosUsos', categoriaIdAreasOutrosUsos) +
        this.tag('culturaIdAreaOutrosUsos', ou.culturaId ?? 0) +
        this.tag('areaUtilizadaOutrosUsos', n4(ou.areaUtilizada)) +
        this.tag('indicadorGeralDeRestricaoOutrosUsos', s(ou.indicadorGeralDeRestricao ?? 0)) +
      `</item>`
    ).join('');

    // CORREÇÃO: Só incluir areaSemRestricao se houver itens válidos
    const blocoRestricoes = restricoes.length > 0 ? restricoes.map(ar =>
      `<item>` +
        this.tag('categoriaIdAreaInaproveitavel', categoriaIdAreasComRestricao) +
        this.tag('areaInaproveitavelArea', n4(ar.areaUtilizadaRestricao)) +
      `</item>`
    ).join('') : '';

    const blocoPastagem = pastagens.map(p =>
      `<item>` +
        this.tag('categoriaIdAreasComPastagem', categoriaIdAreasComPastagem) +
        this.tag('tipoPastagem', this.normalizaPastagem(p.tipoPastagem)) +
        this.tag('areaPastagem', n4(p.areaPastagem)) +
        this.tag('indicadorGeralDeRestricaoPastagem', s(p.indicadorGeralDeRestricao ?? 0)) +
      `</item>`
    ).join('');

    const blocoPecuaria = pecuaria.map(pc =>
      `<item>` +
        this.tag('categoriaId', categoriaIdInfoPecuaria) +
        this.tag('categoriaAnimalId', pc.categoriaAnimalId ?? 0) +
        this.tag('quantidadeAnimal', pc.quantidadeAnimal ?? 0) +
      `</item>`
    ).join('');

    // CORREÇÃO: Só incluir areaSemRestricaoSemUso se houver itens válidos
    const blocoSemUso = semUso.length > 0 ? semUso.map(sr =>
      `<item>` +
        this.tag('categoriaIdAreasSemRestricaoSemUso', categoriaIdAreasSemRestricaoSemUso) +
        this.tag('areaAproveitavelNaoUtilizada', n4(sr.areaAproveitavelNaoUtilizada)) +
      `</item>`
    ).join('') : '';

    const uf = municipio?.uf || '';
    const mun = municipio?.nome || '';
    const cod = ag.lote?.municipioId || 0; // usa o municipioId do lote

    return (
      `<declaracaoUso uf="${this.x(uf)}" municipio="${this.x(mun)}">` +
        this.tag('codMunicipio', cod) +
        `<vegetalConsorcio>${blocoConsorcio}</vegetalConsorcio>` +
        `<vegetalIsolado>${blocoIsolado}</vegetalIsolado>` +
        `<vegetalRotacao>${blocoRotacao}</vegetalRotacao>` +
        `<areasGranjeira>${blocoGranjeira}</areasGranjeira>` +
        `<areasOutrosUsos>` +
          blocoOutrosUsos +
          (blocoRestricoes ? `<areaSemRestricao>${blocoRestricoes}</areaSemRestricao>` : '') +
        `</areasOutrosUsos>` +
        `<areaComPastagem>${blocoPastagem}</areaComPastagem>` +
        `<infoPecuaria>${blocoPecuaria}</infoPecuaria>` +
        (blocoSemUso ? `<areaSemRestricaoSemUso>${blocoSemUso}</areaSemRestricaoSemUso>` : '') +
      `</declaracaoUso>`
    );
  }

  private buildDeclaracaoPessoa(ag: Geo7LoteAgregado): string {
    const pessoas = ag.pessoas || [];
    const blocos = pessoas.map(px => {
      const p = px.pessoa;
      const pl = px.pessoaLote;
      const end = px.endereco;
      const doc = px.documento;
      const conjuge = px.conjuge;

      const sn = (v: any) => this.sn(v);
      const n4 = (v: any) => this.nf(v);

      return (
        `<pessoa codigoCadastro="${this.x(String(p?.id ?? ag.lote?.id ?? 0))}">` +
          this.tag('nome', p?.nome) +
          this.tag('logradouro', end?.logradouro) +
          this.tag('numeroCasa', end?.numero || 0) +
          this.tag('complemento', end?.complemento) +
          this.tag('bairro', end?.bairro) +
          this.tag('nomeMunicipio', end?.municipioNome) +
          this.tag('uf', end?.uf) +
          this.tag('cep', end?.cep) +
          this.tag('ddd', '') + // se existir no seu modelo
          this.tag('telefone', p?.telefone) +
          this.tag('isEspolio', sn(p?.isEspolio)) +

          this.tag('cpf', doc?.cpf) +
          this.tag('dataNascimento', this.iso(p?.dataNascimento)) +
          this.tag('sexoPessoa', p?.sexoPessoa) +
          this.tag('estadoCivil', doc?.estadoCivil || 0) +

          this.tag('nomeConjuge', conjuge?.nome || '') +
          this.tag('cpfConjuge', conjuge?.cpf || '') +
          this.tag('rgConjuge', conjuge?.numeroDocumentoIdentificacao || 0) +
          this.tag('orgaoEmissorConjuge', conjuge?.orgaoEmissor || '') +
          this.tag('ufOrgaoEmissorConjuge', conjuge?.ufOrgaoEmissor || '') +

          this.tag('tipoDocumentoIdentificacao', doc?.tipoDocumentoIdentificacao || 0) +
          this.tag('numeroDocumentoIdentificacao', doc?.numeroDocumentoIdentificacao) +
          this.tag('orgaoEmissor', doc?.orgaoEmissor) +
          this.tag('ufOrgaoEmissor', doc?.ufOrgaoEmissor) +

          this.tag('nacionalidade', doc?.tipoNacionalidade || 0) +
          this.tag('municipioNacionalidade', '') +
          this.tag('ufNaturalidade', end?.uf) +
          this.tag('nomePai', p?.nomePai) +
          this.tag('nomeMae', p?.nomeMae) +

          this.tag('condicaoPessoaImovelRural', pl?.condicaoPessoaImovelRural || 0) +
          this.tag('isDeclarante', sn(pl?.isDeclarante)) +
          this.tag('isResideNoImovel', sn(pl?.isResideNoImovel)) +
          this.tag('percentDetencao', n4(pl?.percentDetencao)) +

          this.tag('tipoPessoa', doc?.tipoPessoa || 1) +
          this.tag('cnpj', doc?.cnpj) +
          this.tag('naturezaJuridica', doc?.naturezaJuridica || 0) +
          this.tag('ufPaisSede', doc?.ufPaisSede) +
          this.tag('capitalNacional', doc?.capitalNacional || 0) +
          this.tag('capitalEstrangeiro', doc?.capitalEstrangeiro || 0) +

          this.tag('dataCasamento', this.iso(p?.dataCasamento)) +
          this.tag('regimeDeBens', p?.regimeDeBens || 0) +
          this.tag('ordem', 1) +

          this.tag('coordenadaEste', p?.coordenadaEste) +
          this.tag('coordenadaNorte', p?.coordenadaNorte) +

          this.tag('isRecebePronaf', sn(p?.isRecebePronaf)) +
          this.tag('isRecebeAjudoProgramaGoverno', sn(p?.isRecebeAjudoProgramaGoverno)) +
          this.tag('atividadePrincipalExploracao', pl?.atividadePrincipalExploracao) +

          this.tag('valorTotalPronafs', n4(p?.valorTotalPronafs)) +
          this.tag('atividadePrincipal', p?.atividadePrincipal) +
          this.tag('qtdPronaf', p?.qtdPronaf ?? 0) +
        `</pessoa>`
      );
    }).join('');

    return `<declaracaoPessoa>${blocos}</declaracaoPessoa>`;
  }

  // --------------------------
  // Helpers
  // --------------------------

  private tag(name: string, value: any): string {
    const v = this.s(value);
    if (v === '') return `<${name}/>`;
    return `<${name}>${this.x(v)}</${name}>`;
  }

  private s(v: any): string {
    if (v === null || v === undefined) return '';
    return String(v);
  }

  private x(v: string): string {
    return v
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  private nf(v: any, frac: number = 4): string {
    const n = Number(v);
    if (!isFinite(n)) return '0.0000';
    return n.toFixed(frac);
  }

  private sn(v: any): 'SIM' | 'NÃO' {
    if (typeof v === 'string') {
      const t = v.trim().toLowerCase();
      if (['sim', 'true', '1', 's', 'y', 'yes'].includes(t)) return 'SIM';
      if (['nao', 'não', 'false', '0', 'n', 'não', 'no'].includes(t)) return 'NÃO';
    }
    return v ? 'SIM' : 'NÃO';
  }

  private iso(v: any): string {
    if (!v) return '';
    try {
      const d = new Date(v);
      if (isNaN(d.getTime())) return '';
      const pad = (x: number) => x.toString().padStart(2, '0');
      const yyyy = d.getFullYear();
      const MM = pad(d.getMonth() + 1);
      const dd = pad(d.getDate());
      const hh = pad(d.getHours());
      const mm = pad(d.getMinutes());
      const ss = pad(d.getSeconds());
      return `${yyyy}-${MM}-${dd}T${hh}:${mm}:${ss}`;
    } catch {
      return '';
    }
  }

  private normalizaPastagem(v: any): string {
    const t = (this.s(v)).toUpperCase();
    if (['1', 'NATURAL', 'NATIVA'].includes(t)) return 'NATURAL';
    if (['3', 'PLANTADA', 'CULTIVADA'].includes(t)) return 'PLANTADA';
    return 'NATURAL';
  }

  private isVegetal(i: ItemDTO): boolean {
    return i.culturaId != null;
  }

  /** 6(consórcio), 8(rotação), default=isolado */
  private formaExpl(i: ItemDTO): number {
    const t = (this.s(i.formaExploracao)).toUpperCase();
    if (['6', 'CONSORCIO', 'CONSÓRCIO'].includes(t)) return 6;
    if (['8', 'ROTACAO', 'ROTAÇÃO'].includes(t)) return 8;
    return 7; // trate como “isolado” nos builders
  }

  private hasAlgumaFonte(e: EstruturaDTO): boolean {
    return !!(e?.isRioOuRiacho || e?.isAcude || e?.isOlhoDagua || e?.isLagoa || e?.isPoco);
  }

  /** Busca o ID da categoria pelo nome */
  private getCategoriaId(categorias: Categoria[], nomeCategoria: string): number {
    const categoria = categorias.find(c => c.nomeCategoria === nomeCategoria);
    if (categoria) {
      return categoria.id;
    }
    
    // Fallbacks baseados na tabela categoria
    if (nomeCategoria === 'PRODUTO_VEGETAL_ISOLADO') return 1;
    if (nomeCategoria === 'PRODUTO_VEGETAL_CONSORCIO_OU_ROTACAO') return 2;
    if (nomeCategoria === 'AREAS_DE_EXPLORACAO_ACRICOLA_OU_GRANJEIRA') return 3;
    if (nomeCategoria === 'AREAS_COM_RESTRICAO') return 4;
    if (nomeCategoria === 'AREAS_DE_PASTAGEM') return 5;
    if (nomeCategoria === 'AREAS_COM_OUTRO_USO') return 6;
    if (nomeCategoria === 'INFOMACOES_SOBRE_PECUARIA') return 7;
    if (nomeCategoria === 'AREAS_SEM_RESTICAO_E_SEM_USO') return 8;
    
    return 0; // fallback padrão
  }

  /** Busca o código da cultura pelo ID */
  private getCodigoCultura(culturas: Cultura[], culturaId: number | null | undefined): number {
    if (!culturaId) return 0;
    
    const cultura = culturas.find(c => c.id === culturaId);
    if (cultura && cultura.codigoCultura) {
      return cultura.codigoCultura;
    }
    
    return culturaId; // fallback para o ID original se não encontrar o código
  }

  /** Deriva flags de uso d’água a partir das strings de usoDagua* */
  private usosDaguaInclui(e: EstruturaDTO, tokens: string[]): boolean {
    const campos = [
      e.usoDaguaRioOuRiacho, e.usoDaguaAcude, e.usoDaguaOlhoDagua, e.usoDaguaLagoa, e.usoDaguaPoco
    ].filter(Boolean).map(s => String(s).toUpperCase());
    return tokens.some(t => campos.some(c => c.includes(String(t).toUpperCase())));
  }
}
