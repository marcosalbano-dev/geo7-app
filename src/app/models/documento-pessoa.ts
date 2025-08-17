import { Municipio } from './municipio';
import { SituacaoJuridica } from './situacao-juridica';
import { FormaObtencao } from './forma-obtencao';

export class DocumentoPessoa {
    id?: number; // Não definido ao criar nova instância, será atribuído pelo backend
    pessoaId?: number;
    tipoDocumentoIdentificacao?: string;
    numeroDocumentoIdentificacao?: string;
    orgaoEmissor?: string;
    ufOrgaoEmissor?: string;
    tipoNacionalidade?: string;
    cpf?: string;
    codigoPaisOrigem?: string;
    estadoCivil?: string;
    tipoPessoa?: string;
    cnpj?: string;
    naturezaJuridica?: string;
    capitalNacional?: number;
    capitalEstrangeiro?: number;
    registroJuntaComercial?: string;
    nomeFantasia?: string;
    codigoPaisSede?: string;
    ufPaisSede?: string;
    tipoDocumentoRepresentanteLegal?: string;
    numeroDocumentoRepresentanteLegal?: string;
    codigoPaisResidencia?: string;
    tipoDePoder?: string;
    tipoDeGoverno?: string;
    percentCapitalNacional?: string;
    percentCapitalEstrangeiro?: string;
    pcePais?: string;
    pcePercentCapital?: string;
    obsevacoesQuadro7?: string;
    naturalidadeId?: number; // FK para Município (naturalidade)

    constructor(init?: Partial<DocumentoPessoa>) {
        this.id = init?.id ?? 0;
        this.pessoaId = init?.pessoaId;
        this.tipoDocumentoIdentificacao = init?.tipoDocumentoIdentificacao ?? '';
        this.numeroDocumentoIdentificacao = init?.numeroDocumentoIdentificacao ?? '';
        this.orgaoEmissor = init?.orgaoEmissor ?? '';
        this.ufOrgaoEmissor = init?.ufOrgaoEmissor ?? '';
        this.tipoNacionalidade = init?.tipoNacionalidade ?? '';
        this.cpf = init?.cpf ?? '';
        this.codigoPaisOrigem = init?.codigoPaisOrigem ?? '';
        this.estadoCivil = init?.estadoCivil ?? '';
        this.tipoPessoa = init?.tipoPessoa ?? '';
        this.cnpj = init?.cnpj ?? '';
        this.naturezaJuridica = init?.naturezaJuridica ?? '';
        this.capitalNacional = init?.capitalNacional ?? 0;
        this.capitalEstrangeiro = init?.capitalEstrangeiro ?? 0;
        this.registroJuntaComercial = init?.registroJuntaComercial ?? '';
        this.nomeFantasia = init?.nomeFantasia ?? '';
        this.codigoPaisSede = init?.codigoPaisSede ?? '';
        this.ufPaisSede = init?.ufPaisSede ?? '';
        this.tipoDocumentoRepresentanteLegal = init?.tipoDocumentoRepresentanteLegal ?? '';
        this.numeroDocumentoRepresentanteLegal = init?.numeroDocumentoRepresentanteLegal ?? '';
        this.codigoPaisResidencia = init?.codigoPaisResidencia ?? '';
        this.tipoDePoder = init?.tipoDePoder ?? '';
        this.tipoDeGoverno = init?.tipoDeGoverno ?? '';
        this.percentCapitalNacional = init?.percentCapitalNacional ?? '';
        this.percentCapitalEstrangeiro = init?.percentCapitalEstrangeiro ?? '';
        this.pcePais = init?.pcePais ?? '';
        this.pcePercentCapital = init?.pcePercentCapital ?? '';
        this.obsevacoesQuadro7 = init?.obsevacoesQuadro7 ?? '';
        this.naturalidadeId = init?.naturalidadeId ?? 0;
    }

    static newLote(): DocumentoPessoa {
        return new DocumentoPessoa();
    }
}
