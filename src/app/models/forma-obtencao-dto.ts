export interface FormaObtencaoDTO {
    id?: number;
    descricaoFormaDeObtencao: string;
    oficio?: string;
    matricula?: string;
    livro?: string;
    nomeCartorio?: string;
    dataRegistro?: string; // ou Date
    numeroRegistro?: string;
    areaRegistrada?: number;
    areaMedida?: number;
    municipioCartorio?: string;
    numeroHerdeiros?: number;
    dataPosse?: string; // ou Date
    situacaoJuridicaId: number;
  }