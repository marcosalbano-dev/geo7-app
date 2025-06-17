export interface SituacaoJuridicaDTO {
    loteId: number;
    nome: string;
    situacaoSelecionada: string;
    formaObtencaoSelecionada?: string;
    dataPosse?: string;
    areaPosse?: string;
    livro?: string;
    areaRegistrada?: string;
    nomeCartorio?: string;
    municipioCartorio?: string;
    dataRegistro?: string;
    oficio?: string;
    matricula?: string;
    numeroRegistro?: string;
  }