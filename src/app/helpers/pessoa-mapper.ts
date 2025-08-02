// src/app/helpers/pessoa-mapper.ts

import { FormGroup } from '@angular/forms';
import { PessoaDTO } from '../models/pessoa.dto';

export function mapFormToPessoaDTO(dto: Partial<PessoaDTO>) {
    return {
      // ...outros campos
      programasDoGovernoIds: dto.programasSelecionados ?? [],
      // ...outros campos
    };
  }

export function pessoaDtoToFormPessoas(dto: Partial<PessoaDTO>) {
    return {
        municipioId: (dto as any).municipioId ?? null,        // pode ser necessário
        loteId: (dto as any).loteId ?? null,
        nome: dto.nome ?? '',
        endereco: dto.endereco ?? '',
        numero: dto.numero ?? '',
        complemento: dto.complemento ?? '',
        bairro: dto.bairro ?? '',
        municipioResidencia: dto.municipioResidencia ?? '',
        uf: dto.uf ?? '',
        cep: dto.cep ?? '',
        telefone: dto.telefone ?? '',
        email: dto.email ?? '',
        tipoPessoa: dto.tipoPessoa ?? 'FISICA',
    };
}

export function pessoaDtoToFormFisica(dto: Partial<PessoaDTO>) {
    return {
        cpf: dto.cpf ?? '',
        nascimento: dto.nascimento ?? '',
        sexo: dto.sexo ?? '',
        espolio: dto.espolio ?? '',
        raca: dto.raca ?? '',
        estadoCivil: dto.estadoCivil ?? '',
        casamento: dto.casamento ?? '',
        regimeBens: dto.regimeBens ?? '',
        tipoDocumento: dto.tipoDocumento ?? '',
        numeroDocumento: dto.numeroDocumento ?? '',
        orgaoEmissor: dto.orgaoEmissor ?? '',
        ufOrgaoEmissor: dto.ufOrgaoEmissor ?? '',
        nacionalidade: dto.nacionalidade ?? '',
        ufNaturalidade: dto.ufNaturalidade ?? '',
        municipioNaturalidade: dto.municipioNaturalidade ?? '',
        codPaisOrigem: dto.codPaisOrigem ?? '',
        codPaisResidencia: dto.codPaisResidencia ?? '',
        nomePai: dto.nomePai ?? '',
        nomeMae: dto.nomeMae ?? '',
    };
}

export function pessoaDtoToFormJuridica(dto: Partial<PessoaDTO>) {
    return {
        cnpj: dto.cnpj ?? '',
        natureza: dto.natureza ?? '',
        tipoPoder: dto.tipoPoder ?? '',
        tipoGoverno: dto.tipoGoverno ?? '',
        ufPaisSede: dto.ufPaisSede ?? '',
        codPaisSede: dto.codPaisSede ?? '',
        capitalNacional: dto.capitalNacional ?? '',
        capitalEstrangeiro: dto.capitalEstrangeiro ?? '',
        regJuntaComercial: dto.regJuntaComercial ?? '',
    };
}

export function pessoaDtoToFormPessoaLote(dto: Partial<PessoaDTO>) {
    return {
        loteId: (dto as any).loteId ?? null,
        numero: (dto as any).numeroLote ?? '', // caso precise
        condicaoPessoaImovelRural: dto.condicao ?? '',
        percentDetencao: dto.percentDetencao ?? '',
        isDeclarante: typeof dto.declarante === 'string'
            ? dto.declarante === 'S'
            : !!dto.declarante,
        isResideNoImovel: typeof dto.reside === 'string'
            ? dto.reside === 'S'
            : !!dto.reside,
        atividadePrincipalExploracao: dto.atividade ?? '',
        qtdAreaCedida: dto.qtdAreaCedida ?? '',
        terminoContrato: dto.terminoContrato ?? '',
        tipoContrato: dto.tipoContrato ?? '',
        // campos extras (ajuste conforme seu form)
        // percentDetencao, tipoDoAto, numeroAto, dataAto, etc.
    };
}
