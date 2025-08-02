import { FormGroup } from "@angular/forms";
import { EnderecoPessoaDTO } from "../models/endereco-pessoa-dto";

export function formToEnderecoPessoaDTO(form: FormGroup): EnderecoPessoaDTO {
    return {
      bairro: form.get('bairro')?.value,
      cep: form.get('cep')?.value,
      codigoPaisResidencia: form.get('codigoPaisResidencia')?.value,
      complemento: form.get('complemento')?.value,
      logradouro: form.get('logradouro')?.value,
      municipioId: form.get('municipioId')?.value, // <-- obrigatório
      numero: form.get('numero')?.value,
      //municipioNome: form.get('municipioNome')?.value,
      uf: form.get('uf')?.value,
      pessoaId: form.get('pessoaId')?.value
    };
  }
  