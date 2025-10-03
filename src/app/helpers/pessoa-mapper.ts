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
    console.log('[PessoaMapper] 🔍 Dados recebidos para mapeamento:', p);
    console.log('[PessoaMapper] 🔍 sexoPessoa:', p?.sexoPessoa);
    console.log('[PessoaMapper] 🔍 atividadePrincipal:', p?.atividadePrincipal);
    console.log('[PessoaMapper] 🔍 isEspolio:', p?.isEspolio);
    console.log('[PessoaMapper] 🔍 racaCor:', p?.racaCor);
    console.log('[PessoaMapper] 🔍 regimeDeBens:', p?.regimeDeBens);
    console.log('[PessoaMapper] 🔍 estadoCivil:', p?.estadoCivil);
    
    const result = {
      dataNascimento: p?.dataNascimento ? new Date(p.dataNascimento) : null,
      sexoPessoa: p?.sexoPessoa?.toUpperCase() ?? '', // ✅ CORRIGIDO: converte para maiúsculo para corresponder aos options
      isEspolio: !!p?.isEspolio,
      racaCor: p?.racaCor?.toUpperCase() ?? '', // ✅ CORRIGIDO: converte para maiúsculo
      estadoCivil: p?.estadoCivil?.toUpperCase() ?? '', // ✅ CORRIGIDO: converte para maiúsculo
      dataCasamento: p?.dataCasamento ? new Date(p.dataCasamento) : null, // ✅ CORRIGIDO: converte String para Date
      regimeBens: p?.regimeDeBens?.toUpperCase() ?? '', // ✅ CORRIGIDO: converte para maiúsculo para corresponder aos options
      escolaridade: p?.escolaridade ?? '', // ✅ ADICIONADO
      profissao: p?.atividadePrincipal ?? '', // ✅ CORRIGIDO: usa atividadePrincipal do backend
      nomePai: p?.nomePai ?? '',
      nomeMae: p?.nomeMae ?? '',
    };
    
    console.log('[PessoaMapper] 🔍 Resultado do mapeamento:', result);
    console.log('[PessoaMapper] 🔍 Valores específicos:');
    console.log('[PessoaMapper] 🔍 - sexo:', result.sexoPessoa);
    console.log('[PessoaMapper] 🔍 - racaCor:', result.racaCor);
    console.log('[PessoaMapper] 🔍 - regimeBens:', result.regimeBens);
    console.log('[PessoaMapper] 🔍 - estadoCivil:', result.estadoCivil);
    return result;
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
