// src/app/helpers/pessoa-mapper.ts

import { FormGroup } from '@angular/forms';
import { PessoaDTO } from '../models/pessoa.dto';

export function pessoaToFormPessoas(p?: any) {
    return {
      nome: p?.nome ?? '',
      telefone: p?.telefone ?? '',
      email: p?.email ?? '',
      tipoPessoa: 'FISICA', // o patchAll troca se vier JURIDICA
    };
  }

export function mapFormToPessoaDTO(dto: Partial<PessoaDTO>) {
    return {
      // ...outros campos
      programasDoGovernoIds: dto.programasSelecionados ?? [],
      // ...outros campos
    };
  }


export function pessoaToFormFisica(p?: any) {
    return {
      dataNascimento: p?.dataNascimento ? new Date(p.dataNascimento) : null,
      sexoPessoa: p?.sexoPessoa ?? '',
      isEspolio: !!p?.isEspolio,
      racaCor: p?.racaCor ?? '',
      dataCasamento: p?.dataCasamento ?? null,
      regimeBens: p?.regimeDeBens ?? '',
      nomePai: p?.nomePai ?? '',
      nomeMae: p?.nomeMae ?? '',
    };
  }

  export function enderecoToForm(e?: any) {
    return {
      logradouro: e?.logradouro ?? '',
      complemento: e?.complemento ?? '',
      numero: e?.numero ?? '',
      bairro: e?.bairro ?? '',
      cep: e?.cep ?? '',
      codigoPaisResidencia: e?.codigoPaisResidencia ?? '931',
      municipioId: e?.municipioId ?? null,
      uf: e?.uf ?? null,
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
