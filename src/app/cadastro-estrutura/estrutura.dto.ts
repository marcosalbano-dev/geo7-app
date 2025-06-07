export interface EstruturaDTO {
    id: number | null;
    loteId: number;
  
    ativo: boolean;
    dhc: string; // ISO Date
    dhm: string;
  
    familiasResidentes: number;
    pessoasResidentes: number;
    trabalhadoresComCarteira: number;
    trabalhadoresSemCarteira: number;
    maoDeObraFamiliar: number;
  
    valorTotal: number;
    valorDasBenfeitorias: number;
    valorOutrasAtividades: number;
    valorTerraNua: number;
    areaIrrigada: number;
  
    litigio: string;
    entregouMemorialPlanilha: boolean;
    destinacaoDoImovel: string;
    pontoDeReferencia: string;
    numeroHerdeiros: number;
    porcentagemDetencao: number;
    obsLitigio: string;
  
    isFonteAguaExterna: boolean;
    isPossuiElergiaEletrica: boolean;
    isPossuiEnergiaAlternativa: boolean;
    tipoEnergiaEletrica: string;
    isIrrigacao: boolean;
    isAcude: boolean;
    isAcudePerene: boolean;
    usoDaguaAcude: string;
    isLagoa: boolean;
    isLagoaPerene: boolean;
    usoDaguaLagoa: string;
    isPoco: boolean;
    isPocoPerene: boolean;
    usoDaguaPoco: string;
    isRioOuRiacho: boolean;
    isRioOuRiachoPerene: boolean;
    usoDaguaRioOuRiacho: string;
    isOlhoDagua: boolean;
    isOlhoDaguaPerene: boolean;
    usoDaguaOlhoDagua: string;
    isRedeDeAbastecimento: boolean;
  }
  