export class EnderecoPessoa {
    id?: number; // Não definido ao criar nova instância, será atribuído pelo backend
    logradouro?: string;
    complemento?: string;
    numero?: string;
    bairro?: string;
    cep?: string;
    codigoPaisResidencia?: string;
    municipioId: number = 0;
    pessoaId?: number;
  
    constructor(init?: Partial<EnderecoPessoa>) {
        Object.assign(this, init);
        // this.id = init?.id ?? 0;
        // this.logradouro = init?.logradouro ?? '';
        // this.complemento = init?.complemento ?? '';
        // this.numero = init?.numero ?? '';
        // this.bairro = init?.bairro ?? '';
        // this.cep = init?.cep ?? '';
        // this.codigoPaisResidencia = init?.codigoPaisResidencia ?? '';
        // this.municipioId = init?.municipioId ?? 0;
    }
  
    static newEnderecoPessoa(): EnderecoPessoa {
        return new EnderecoPessoa();
    }
}