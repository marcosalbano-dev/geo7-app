import { Lote } from '../cadastro-lotes/lote'; // Importe o modelo do Lote correspondente, se necessário

export class Estrutura {
    id?: number; // Não definido ao criar nova instância, será atribuído pelo backend
    lote!: Lote;

    ativo: boolean = true;
    dhc: Date = new Date();
    dhm: Date = new Date();

    familiasResidentes: number = 0;
    pessoasResidentes: number = 0;
    trabalhadoresComCarteira: number = 0;
    trabalhadoresSemCarteira: number = 0;
    maoDeObraFamiliar: number = 0;

    valorTotal: number = 0;
    valorDasBenfeitorias: number = 0;
    valorOutrasAtividades: number = 0;
    valorTerraNua: number = 0;
    areaIrrigada: number = 0;

    litigio: string = '';
    entregouMemorialPlanilha: boolean = false;
    destinacaoDoImovel: string = '';
    pontoDeReferencia: string = '';
    numeroHerdeiros: number = 0;
    porcentagemDetencao: number = 0;
    obsLitigio: string = '';

    isFonteAguaExterna: boolean = false;
    isPossuiElergiaEletrica: boolean = false;
    isPossuiEnergiaAlternativa: boolean = false;
    tipoEnergiaEletrica: string = '';
    isIrrigacao: boolean = false;
    isAcude: boolean = false;
    isAcudePerene: boolean = false;
    usoDaguaAcude: string = '';
    isLagoa: boolean = false;
    isLagoaPerene: boolean = false;
    usoDaguaLagoa: string = '';
    isPoco: boolean = false;
    isPocoPerene: boolean = false;
    usoDaguaPoco: string = '';
    isRioOuRiacho: boolean = false;
    isRioOuRiachoPerene: boolean = false;
    usoDaguaRioOuRiacho: string = '';
    isOlhoDagua: boolean = false;
    isOlhoDaguaPerene: boolean = false;
    usoDaguaOlhoDagua: string = '';
    isRedeDeAbastecimento: boolean = false;

    static newEstrutura(): Estrutura {
        return new Estrutura();
    }
}