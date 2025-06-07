import { Municipio } from '../models/municipio';
import { SituacaoJuridica } from '../cadastro-situacao-juridica/situacao-juridica';
import { FormaObtencao } from '../cadastro-forma-obtencao/forma-obtencao';

export class Lote {
  id: number;
  proprietario: string;
  area: number;
  denominacaoImovel: string;
  numero: string;
  dhc: Date;
  dhm: Date;
  perimetro: number;
  sncr: string;
  cpf: string;
  municipio: Municipio;
  formaObtencao: FormaObtencao[];
  situacaoJuridica: SituacaoJuridica;
  dataTerminoPeriodoDeUso: string;

  constructor(init?: Partial<Lote>) {
      this.id = init?.id ?? 0;
      this.proprietario = init?.proprietario ?? '';
      this.area = init?.area ?? 0;
      this.denominacaoImovel = init?.denominacaoImovel ?? '';
      this.numero = init?.numero ?? '';
      this.dhc = init?.dhc ? new Date(init.dhc) : new Date();
      this.dhm = init?.dhm ? new Date(init.dhm) : new Date();
      this.perimetro = init?.perimetro ?? 0;
      this.sncr = init?.sncr ?? '';
      this.cpf = init?.cpf ?? '';
      this.municipio = init?.municipio ?? {} as Municipio;
      this.formaObtencao = init?.formaObtencao ?? [];
      this.situacaoJuridica = init?.situacaoJuridica ?? {} as SituacaoJuridica;
      this.dataTerminoPeriodoDeUso = init?.dataTerminoPeriodoDeUso ?? '';
  }

  static newLote(): Lote {
      return new Lote();
  }
}
