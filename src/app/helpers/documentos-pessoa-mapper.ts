import { FormControl, FormGroup } from "@angular/forms";

// helpers genéricas
export function toggleControls(
  form: FormGroup,
  keys: string[],
  enable: boolean,
  clear = false
) {
  keys.forEach(k => {
    let c = form.get(k);
    if (!c) {
      // cria o controle se não existir para evitar o erro no template
      c = new FormControl(null);
      form.addControl(k, c);
    }
    if (enable) c.enable({ emitEvent: false });
    else c.disable({ emitEvent: false });

    if (clear) c.reset({ value: null, disabled: !enable }, { emitEvent: false });
  });
}

export function documentoToForm(d?: any, e?: any) {
  return {
    id: d?.id ?? null,
    pessoaId: d?.pessoaId ?? null,

    // identificação
    tipoDocumentoIdentificacao: d?.tipoDocumentoIdentificacao ?? '',
    numeroDocumentoIdentificacao: d?.numeroDocumentoIdentificacao ?? '',
    orgaoEmissor: d?.orgaoEmissor ?? '',
    ufOrgaoEmissor: d?.ufOrgaoEmissor ?? '',

    // nacionalidade/naturalidade
    tipoNacionalidade: (d?.tipoNacionalidade ?? '') || '',
    ufNaturalidade: d?.ufNaturalidade ?? null,        // pode vir vazio (usamos fallback via ibgeToUF)
    naturalidadeId: d?.naturalidadeId ?? null,

    // PF
    cpf: d?.cpf ?? '',
    estadoCivil: (d?.estadoCivil ?? '') || '',
    tipoPessoa: d?.tipoPessoa ?? 'FISICA',

    // códigos de país (com fallback do endereço)
    codigoPaisOrigem: d?.codigoPaisOrigem ?? d?.codigoPaisOrigem ?? '',
    codigoPaisResidencia: d?.codigoPaisResidencia ?? e?.codigoPaisResidencia ?? '',

    // PJ (mantém aqui mesmo, seu form já tem esses controles)
    cnpj: d?.cnpj ?? '',
    naturezaJuridica: d?.naturezaJuridica ?? '',
    registroJuntaComercial: d?.registroJuntaComercial ?? '',
    codigoPaisSede: d?.codigoPaisSede ?? '',
    ufPaisSede: d?.ufPaisSede ?? '',
    capitalNacional: d?.capitalNacional ?? null,
    capitalEstrangeiro: d?.capitalEstrangeiro ?? null,
    percentCapitalNacional: d?.percentCapitalNacional ?? null,
    percentCapitalEstrangeiro: d?.percentCapitalEstrangeiro ?? null,
    pcePais: d?.pcePais ?? '',
    pcePercentCapital: d?.pcePercentCapital ?? null,

    obsevacoesQuadro7: d?.obsevacoesQuadro7 ?? '',
  };
}
