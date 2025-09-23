// src/app/shared/export-xml.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ExportXmlService {
  /** util: cria elemento com texto opcional e anexa no pai */
  private el(doc: XMLDocument, parent: Element, name: string, text?: string | number | null) {
    const e = doc.createElement(name);
    if (text !== undefined && text !== null) e.textContent = String(text);
    parent.appendChild(e);
    return e;
  }

  /** util: cria elemento com atributos e anexa no pai */
  private elAttr(
    doc: XMLDocument,
    parent: Element,
    name: string,
    attrs: Record<string, string | number | boolean | null>
  ) {
    const e = doc.createElement(name);
    Object.entries(attrs || {}).forEach(([k, v]) => {
      if (v !== null && v !== undefined) e.setAttribute(k, String(v));
    });
    parent.appendChild(e);
    return e;
  }

  /** Cabeçalho/base do documento (exportacaoDP > _declaracoes > imoveis) */
  private createBaseDoc() {
    const doc = document.implementation.createDocument('', '', null);
    const exportacaoDP = this.el(doc, doc as any, 'exportacaoDP');
    const _declaracoes = this.el(doc, exportacaoDP, '_declaracoes');
    const imoveis = this.el(doc, _declaracoes, 'imoveis');
    return { doc, imoveis };
  }

  /** Apende UM imóvel dentro de <imoveis> como <lotes><imovel>...</imovel></lotes> */
  private appendImovel(doc: XMLDocument, imoveisEl: Element, data: ImovelCompleto) {
    const lotes = this.elAttr(doc, imoveisEl, 'lotes', { numeroLote: data.numeroLote });

    const imovel = this.elAttr(doc, lotes, 'imovel', {
      numeroLote: data.numeroLote,
      sncr: data.sncr,
      cpfLotes: data.cpfLotes,
    });

    // ===================== <declaracaoEstrutura> =====================
    const de = this.el(doc, imovel, 'declaracaoEstrutura');
    this.el(doc, de, 'codigoCadastro', data.declaracaoEstrutura.codigoCadastro);
    this.el(doc, de, 'proprietario', data.declaracaoEstrutura.proprietario);
    this.el(doc, de, 'areaMedida', data.declaracaoEstrutura.areaMedida);
    this.el(doc, de, 'denominacaoImovelRural', data.declaracaoEstrutura.denominacaoImovelRural);
    this.el(doc, de, 'situacaoJuridica', data.declaracaoEstrutura.situacaoJuridica);
    this.el(doc, de, 'indicacaoLocalizacao', data.declaracaoEstrutura.indicacaoLocalizacao);
    this.el(doc, de, 'codImoReceita', data.declaracaoEstrutura.codImoReceita ?? '');
    this.el(doc, de, 'localidade', data.declaracaoEstrutura.localidade);
    this.el(doc, de, 'nomeDistrito', data.declaracaoEstrutura.nomeDistrito);
    this.el(doc, de, 'familiasResidentes', data.declaracaoEstrutura.familiasResidentes);
    this.el(doc, de, 'pessoasResidentes', data.declaracaoEstrutura.pessoasResidentes);
    this.el(doc, de, 'trabalhadoresComCarteira', data.declaracaoEstrutura.trabalhadoresComCarteira);
    this.el(doc, de, 'trabalhadoresSemCarteira', data.declaracaoEstrutura.trabalhadoresSemCarteira);
    this.el(doc, de, 'maoObraFamiliar', data.declaracaoEstrutura.maoObraFamiliar);
    this.el(doc, de, 'valorTotal', data.declaracaoEstrutura.valorTotal);
    this.el(doc, de, 'valorBenfeitorias', data.declaracaoEstrutura.valorBenfeitorias);
    this.el(doc, de, 'valorOutrasAtividades', data.declaracaoEstrutura.valorOutrasAtividades);
    this.el(doc, de, 'valorTerraNua', data.declaracaoEstrutura.valorTerraNua);
    this.el(doc, de, 'codigoDestinacaoDoImovel', data.declaracaoEstrutura.codigoDestinacaoDoImovel);
    this.el(doc, de, 'codigoLitigio', data.declaracaoEstrutura.codigoLitigio);
    this.el(doc, de, 'tipoEnergiaEletrica', data.declaracaoEstrutura.tipoEnergiaEletrica ?? '');
    this.el(doc, de, 'isIrrigacao', data.declaracaoEstrutura.isIrrigacao);
    this.el(doc, de, 'isPossuiEnergiaEletrica', data.declaracaoEstrutura.isPossuiEnergiaEletrica);
    this.el(doc, de, 'isPossuiEnergiaAlternativa', data.declaracaoEstrutura.isPossuiEnergiaAlternativa);
    this.el(doc, de, 'isPossuiFonteDagua', data.declaracaoEstrutura.isPossuiFonteDagua);
    this.el(doc, de, 'isPossuiFonteDaguaExterna', data.declaracaoEstrutura.isPossuiFonteDaguaExterna);
    this.el(doc, de, 'numeroHerdeiros', data.declaracaoEstrutura.numeroHerdeiros);
    this.el(doc, de, 'isAcude', data.declaracaoEstrutura.isAcude);
    this.el(doc, de, 'isAcudePerene', data.declaracaoEstrutura.isAcudePerene);
    this.el(doc, de, 'isLagoa', data.declaracaoEstrutura.isLagoa);
    this.el(doc, de, 'isLagoaPerene', data.declaracaoEstrutura.isLagoaPerene);
    this.el(doc, de, 'isPoco', data.declaracaoEstrutura.isPoco);
    this.el(doc, de, 'isPocoPerene', data.declaracaoEstrutura.isPocoPerene);
    this.el(doc, de, 'isRioOuRiacho', data.declaracaoEstrutura.isRioOuRiacho);
    this.el(doc, de, 'isOlhoDagua', data.declaracaoEstrutura.isOlhoDagua);
    this.el(doc, de, 'isOlhoDaguaPerene', data.declaracaoEstrutura.isOlhoDaguaPerene);
    this.el(doc, de, 'isRedeDeAbastecimento', data.declaracaoEstrutura.isRedeDeAbastecimento);
    this.el(doc, de, 'usoAguaAbastecimentoHumano', data.declaracaoEstrutura.usoAguaAbastecimentoHumano);
    this.el(doc, de, 'usoAguaAplicacaoAgricola', data.declaracaoEstrutura.usoAguaAplicacaoAgricola);
    this.el(doc, de, 'usoAguaHumanoAgricola', data.declaracaoEstrutura.usoAguaHumanoAgricola);
    this.el(doc, de, 'usoAguaAbastecimentoAnimal', data.declaracaoEstrutura.usoAguaAbastecimentoAnimal);
    this.el(doc, de, 'usoAguaHumanoAnimalAgricola', data.declaracaoEstrutura.usoAguaHumanoAnimalAgricola);
    this.el(doc, de, 'usoAguaHumanoAnimal', data.declaracaoEstrutura.usoAguaHumanoAnimal);
    this.el(doc, de, 'usoAguaAnimalAgricola', data.declaracaoEstrutura.usoAguaAnimalAgricola);
    this.el(doc, de, 'usoAguaSemUso', data.declaracaoEstrutura.usoAguaSemUso);

    const forma = this.el(doc, de, 'formaObtencao');
    this.el(doc, forma, 'codigoCadastro', data.declaracaoEstrutura.formaObtencao.codigoCadastro);
    this.el(doc, forma, 'areaFormaObtencaoMedida', data.declaracaoEstrutura.formaObtencao.areaFormaObtencaoMedida);
    this.el(doc, forma, 'codFormaObtencao', data.declaracaoEstrutura.formaObtencao.codFormaObtencao);
    this.el(doc, forma, 'dataPosse', data.declaracaoEstrutura.formaObtencao.dataPosse);

    // ===================== <declaracaoUso uf="" municipio=""> =====================
    const du = this.elAttr(doc, imovel, 'declaracaoUso', {
      uf: data.declaracaoUso.uf,
      municipio: data.declaracaoUso.municipio,
    });
    this.el(doc, du, 'codMunicipio', data.declaracaoUso.codMunicipio);

    const vegetalConsorcio = this.el(doc, du, 'vegetalConsorcio');
    (data.declaracaoUso.vegetalConsorcio || []).forEach(v => {
      const item = this.el(doc, vegetalConsorcio, 'item');
      this.el(doc, item, 'categoriaIdVegetalConsorcio', v.categoriaIdVegetalConsorcio);
      this.el(doc, item, 'culturaIdVegetalConsorcio', v.culturaIdVegetalConsorcio);
      this.el(doc, item, 'formaExploracaoVegetalConsorcio', v.formaExploracaoVegetalConsorcio);
      this.el(doc, item, 'sequenciaProdutoVegetalConsorcio', v.sequenciaProdutoVegetalConsorcio);
      this.el(doc, item, 'areaPlantadaVegetalConsorcio', v.areaPlantadaVegetalConsorcio);
      this.el(doc, item, 'areaColhidaVegetalConsorcio', v.areaColhidaVegetalConsorcio);
      this.el(doc, item, 'quantidadeColhidaVegetalConsorcio', v.quantidadeColhidaVegetalConsorcio);
      this.el(doc, item, 'codigoUnidadeExploracaoIdVegetalConsorcio', v.codigoUnidadeExploracaoIdVegetalConsorcio);
      this.el(doc, item, 'indicadorGeralDeRestricaoVegetalConsorcio', v.indicadorGeralDeRestricaoVegetalConsorcio);
    });

    this.el(doc, du, 'areasGranjeira');

    const aou = this.el(doc, du, 'areasOutrosUsos');
    (data.declaracaoUso.areasOutrosUsos.item || []).forEach(o => {
      const item = this.el(doc, aou, 'item');
      this.el(doc, item, 'categoriaIdAreasOutrosUsos', o.categoriaIdAreasOutrosUsos);
      this.el(doc, item, 'culturaIdAreaOutrosUsos', o.culturaIdAreaOutrosUsos);
      this.el(doc, item, 'areaUtilizadaOutrosUsos', o.areaUtilizadaOutrosUsos);
      this.el(doc, item, 'indicadorGeralDeRestricaoOutrosUsos', o.indicadorGeralDeRestricaoOutrosUsos);
    });
    if (data.declaracaoUso.areasOutrosUsos.areaSemRestricao) {
      const asr = this.el(doc, aou, 'areaSemRestricao');
      (data.declaracaoUso.areasOutrosUsos.areaSemRestricao.item || []).forEach(s => {
        const item = this.el(doc, asr, 'item');
        this.el(doc, item, 'categoriaIdAreaInaproveitavel', s.categoriaIdAreaInaproveitavel);
        this.el(doc, item, 'areaInaproveitavel', s.areaInaproveitavel);
        this.el(doc, item, 'areaInaproveitavelArea', s.areaInaproveitavelArea);
      });
    }

    const acp = this.el(doc, du, 'areaComPastagem');
    (data.declaracaoUso.areaComPastagem || []).forEach(p => {
      const item = this.el(doc, acp, 'item');
      this.el(doc, item, 'categoriaIdAreasComPastagem', p.categoriaIdAreasComPastagem);
      this.el(doc, item, 'tipoPastagem', p.tipoPastagem);
      this.el(doc, item, 'areaPastagem', p.areaPastagem);
      this.el(doc, item, 'indicadorGeralDeRestricaoPastagem', p.indicadorGeralDeRestricaoPastagem);
    });

    const ip = this.el(doc, du, 'infoPecuaria');
    (data.declaracaoUso.infoPecuaria || []).forEach(i => {
      const item = this.el(doc, ip, 'item');
      this.el(doc, item, 'categoriaIdInfoPecuaria', i.categoriaIdInfoPecuaria);
      this.el(doc, item, 'categoriaAnimalId', i.categoriaAnimalId);
      this.el(doc, item, 'quantidadeAnimal', i.quantidadeAnimal);
    });

    const assu = this.el(doc, du, 'areaSemRestricaoSemUso');
    (data.declaracaoUso.areaSemRestricaoSemUso || []).forEach(su => {
      const item = this.el(doc, assu, 'item');
      this.el(doc, item, 'categoriaIdAreasSemRestricaoSemUso', su.categoriaIdAreasSemRestricaoSemUso);
      this.el(doc, item, 'areaAproveitavelNaoUtilizada', su.areaAproveitavelNaoUtilizada);
    });

    // ===================== <declaracaoPessoa> =====================
    const dp = this.el(doc, imovel, 'declaracaoPessoa');
    const pessoa = this.elAttr(doc, dp, 'pessoa', { codigoCadastro: data.declaracaoPessoa.pessoa.codigoCadastro });

    const p = data.declaracaoPessoa.pessoa;
    this.el(doc, pessoa, 'nome', p.nome);
    this.el(doc, pessoa, 'logradouro', p.logradouro);
    this.el(doc, pessoa, 'numeroCasa', p.numeroCasa);
    this.el(doc, pessoa, 'complemento', p.complemento ?? '');
    this.el(doc, pessoa, 'bairro', p.bairro);
    this.el(doc, pessoa, 'nomeMunicipio', p.nomeMunicipio);
    this.el(doc, pessoa, 'uf', p.uf);
    this.el(doc, pessoa, 'cep', p.cep);
    this.el(doc, pessoa, 'ddd', p.ddd);
    this.el(doc, pessoa, 'telefone', p.telefone);
    this.el(doc, pessoa, 'isEspolio', p.isEspolio);
    this.el(doc, pessoa, 'cpf', p.cpf);
    this.el(doc, pessoa, 'dataNascimento', p.dataNascimento);
    this.el(doc, pessoa, 'sexoPessoa', p.sexoPessoa);
    this.el(doc, pessoa, 'estadoCivil', p.estadoCivil);
    this.el(doc, pessoa, 'nomeConjuge', p.nomeConjuge ?? '');
    this.el(doc, pessoa, 'cpfConjuge', p.cpfConjuge ?? '');
    this.el(doc, pessoa, 'rgConjuge', p.rgConjuge);
    this.el(doc, pessoa, 'orgaoEmissorConjuge', p.orgaoEmissorConjuge ?? '');
    this.el(doc, pessoa, 'ufOrgaoEmissorConjuge', p.ufOrgaoEmissorConjuge ?? '');
    this.el(doc, pessoa, 'tipoDocumentoIdentificacao', p.tipoDocumentoIdentificacao);
    this.el(doc, pessoa, 'numeroDocumentoIdentificacao', p.numeroDocumentoIdentificacao);
    this.el(doc, pessoa, 'orgaoEmissor', p.orgaoEmissor);
    this.el(doc, pessoa, 'ufOrgaoEmissor', p.ufOrgaoEmissor);
    this.el(doc, pessoa, 'nacionalidade', p.nacionalidade);
    this.el(doc, pessoa, 'municipioNacionalidade', p.municipioNacionalidade);
    this.el(doc, pessoa, 'ufNaturalidade', p.ufNaturalidade);
    this.el(doc, pessoa, 'nomePai', p.nomePai);
    this.el(doc, pessoa, 'nomeMae', p.nomeMae);
    this.el(doc, pessoa, 'condicaoPessoaImovelRural', p.condicaoPessoaImovelRural);
    this.el(doc, pessoa, 'isDeclarante', p.isDeclarante);
    this.el(doc, pessoa, 'isResideNoImovel', p.isResideNoImovel);
    this.el(doc, pessoa, 'percentDetencao', p.percentDetencao);
    this.el(doc, pessoa, 'tipoPessoa', p.tipoPessoa);
    this.el(doc, pessoa, 'cnpj', p.cnpj ?? '');
    this.el(doc, pessoa, 'naturezaJuridica', p.naturezaJuridica);
    this.el(doc, pessoa, 'ufPaisSede', p.ufPaisSede ?? '');
    this.el(doc, pessoa, 'capitalNacional', p.capitalNacional);
    this.el(doc, pessoa, 'capitalEstrangeiro', p.capitalEstrangeiro);
    this.el(doc, pessoa, 'dataCasamento', p.dataCasamento);
    this.el(doc, pessoa, 'regimeDeBens', p.regimeDeBens);
    this.el(doc, pessoa, 'ordem', p.ordem);
    this.el(doc, pessoa, 'coordenadaEste', p.coordenadaEste);
    this.el(doc, pessoa, 'coordenadaNorte', p.coordenadaNorte);
    this.el(doc, pessoa, 'isRecebePronaf', p.isRecebePronaf);
    this.el(doc, pessoa, 'isRecebeAjudoProgramaGoverno', p.isRecebeAjudoProgramaGoverno);
    this.el(doc, pessoa, 'atividadePrincipalExploracao', p.atividadePrincipalExploracao);
    this.el(doc, pessoa, 'valorTotalPronafs', p.valorTotalPronafs);
    this.el(doc, pessoa, 'atividadePrincipal', p.atividadePrincipal);
    this.el(doc, pessoa, 'qtdPronaf', p.qtdPronaf);
  }

  /** Gera um XML contendo TODOS os lotes do município */
  buildXmlMunicipio(lista: ImovelCompleto[]): string {
    const { doc, imoveis } = this.createBaseDoc();
    (lista || []).forEach(item => this.appendImovel(doc, imoveis, item));
    const xml = new XMLSerializer().serializeToString(doc);
    return '<?xml version="1.0" encoding="UTF-8"?>\n' + xml;
  }

  /** Útil caso ainda queira exportar só um lote */
  buildXmlLote(data: ImovelCompleto): string {
    const { doc, imoveis } = this.createBaseDoc();
    this.appendImovel(doc, imoveis, data);
    const xml = new XMLSerializer().serializeToString(doc);
    return '<?xml version="1.0" encoding="UTF-8"?>\n' + xml;
  }

  download(xml: string, filename = 'exportacaoDP.xml') {
    const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}

/** Modelo sugerido (adeque aos nomes do seu back). */
export interface ImovelCompleto {
  numeroLote: string;
  sncr: string;
  cpfLotes: string;
  declaracaoEstrutura: {
    codigoCadastro: string; proprietario: string; areaMedida: string; denominacaoImovelRural: string;
    situacaoJuridica: string; indicacaoLocalizacao: string; codImoReceita?: string;
    localidade: string; nomeDistrito: string; familiasResidentes: string; pessoasResidentes: string;
    trabalhadoresComCarteira: string; trabalhadoresSemCarteira: string; maoObraFamiliar: string;
    valorTotal: string; valorBenfeitorias: string; valorOutrasAtividades: string; valorTerraNua: string;
    codigoDestinacaoDoImovel: string; codigoLitigio: string; tipoEnergiaEletrica?: string;
    isIrrigacao: string; isPossuiEnergiaEletrica: string; isPossuiEnergiaAlternativa: string;
    isPossuiFonteDagua: string; isPossuiFonteDaguaExterna: string; numeroHerdeiros: string;
    isAcude: string; isAcudePerene: string; isLagoa: string; isLagoaPerene: string; isPoco: string;
    isPocoPerene: string; isRioOuRiacho: string; isOlhoDagua: string; isOlhoDaguaPerene: string;
    isRedeDeAbastecimento: string; usoAguaAbastecimentoHumano: string; usoAguaAplicacaoAgricola: string;
    usoAguaHumanoAgricola: string; usoAguaAbastecimentoAnimal: string; usoAguaHumanoAnimalAgricola: string;
    usoAguaHumanoAnimal: string; usoAguaAnimalAgricola: string; usoAguaSemUso: string;
    formaObtencao: { codigoCadastro: string; areaFormaObtencaoMedida: string; codFormaObtencao: string; dataPosse: string; };
  };
  declaracaoUso: {
    uf: string; municipio: string; codMunicipio: string;
    vegetalConsorcio: Array<{
      categoriaIdVegetalConsorcio: string; culturaIdVegetalConsorcio: string; formaExploracaoVegetalConsorcio: string;
      sequenciaProdutoVegetalConsorcio: string; areaPlantadaVegetalConsorcio: string; areaColhidaVegetalConsorcio: string;
      quantidadeColhidaVegetalConsorcio: string; codigoUnidadeExploracaoIdVegetalConsorcio: string;
      indicadorGeralDeRestricaoVegetalConsorcio: string;
    }>;
    areasOutrosUsos: {
      item: Array<{ categoriaIdAreasOutrosUsos: string; culturaIdAreaOutrosUsos: string; areaUtilizadaOutrosUsos: string; indicadorGeralDeRestricaoOutrosUsos: string; }>;
      areaSemRestricao?: { item: Array<{ categoriaIdAreaInaproveitavel: string; areaInaproveitavel: string; areaInaproveitavelArea: string; }>; };
    };
    areaComPastagem: Array<{ categoriaIdAreasComPastagem: string; tipoPastagem: string; areaPastagem: string; indicadorGeralDeRestricaoPastagem: string; }>;
    infoPecuaria: Array<{ categoriaIdInfoPecuaria: string; categoriaAnimalId: string; quantidadeAnimal: string; }>;
    areaSemRestricaoSemUso: Array<{ categoriaIdAreasSemRestricaoSemUso: string; areaAproveitavelNaoUtilizada: string; }>;
  };
  declaracaoPessoa: {
    pessoa: {
      codigoCadastro: string; nome: string; logradouro: string; numeroCasa: string; complemento?: string; bairro: string;
      nomeMunicipio: string; uf: string; cep: string; ddd: string; telefone: string; isEspolio: string; cpf: string;
      dataNascimento: string; sexoPessoa: string; estadoCivil: string; nomeConjuge?: string; cpfConjuge?: string; rgConjuge: string;
      orgaoEmissorConjuge?: string; ufOrgaoEmissorConjuge?: string; tipoDocumentoIdentificacao: string; numeroDocumentoIdentificacao: string;
      orgaoEmissor: string; ufOrgaoEmissor: string; nacionalidade: string; municipioNacionalidade: string; ufNaturalidade: string;
      nomePai: string; nomeMae: string; condicaoPessoaImovelRural: string; isDeclarante: string; isResideNoImovel: string;
      percentDetencao: string; tipoPessoa: string; cnpj?: string; naturezaJuridica: string; ufPaisSede?: string;
      capitalNacional: string; capitalEstrangeiro: string; dataCasamento: string; regimeDeBens: string; ordem: string;
      coordenadaEste: string; coordenadaNorte: string; isRecebePronaf: string; isRecebeAjudoProgramaGoverno: string;
      atividadePrincipalExploracao: string; valorTotalPronafs: string; atividadePrincipal: string; qtdPronaf: string;
    }
  }
}
