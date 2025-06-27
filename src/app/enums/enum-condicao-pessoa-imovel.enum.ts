// condicao-pessoa-imovel.enum.ts
export enum CondicaoPessoaImovel {
  ProprietarioPosseiroIndividual = "12 - Proprietário ou Posseiro Individual",
  ProprietarioPosseiroComum = "14 - Proprietário ou Posseiro Comum",
  Usufrutario = "16 - Usufrutário",
  NuProprietario = "18 - Nu-Proprietário",
  Parceiro = "20 - Parceiro",
  Arrendatario = "22 - Arrendatário",
  Comodatario = "24 - Comodatário",
  Concessionario = "26 - Concessionário"
}

export const CONDICOES_PESSOA_IMOVEL = [
  { value: CondicaoPessoaImovel.ProprietarioPosseiroIndividual, label: "12 - Proprietário ou Posseiro Individual" },
  { value: CondicaoPessoaImovel.ProprietarioPosseiroComum, label: "14 - Proprietário ou Posseiro Comum" },
  { value: CondicaoPessoaImovel.Usufrutario, label: "16 - Usufrutário" },
  { value: CondicaoPessoaImovel.NuProprietario, label: "18 - Nu-Proprietário" },
  { value: CondicaoPessoaImovel.Parceiro, label: "20 - Parceiro" },
  { value: CondicaoPessoaImovel.Arrendatario, label: "22 - Arrendatário" },
  { value: CondicaoPessoaImovel.Comodatario, label: "24 - Comodatário" },
  { value: CondicaoPessoaImovel.Concessionario, label: "26 - Concessionário" },
];
