// Enums refatorados para uso no Angular com mat-select

export enum DestinacaoDoImovel {
    Hortigranjeiro = '01 - Hortigranjeiro',
    ProducaoGraos = '02 - Produção Grãos (Temporários)',
    AgriculturaPermanente = '03 - Agricultura (Permanente)',
    Reflorestamento = '04 - Reflorestamento',
    Extrativismo = '05 - Extrativismo',
    Pecuaria = '06 - Pecuária',
    Industrial = '07 - Industrial',
    Comercial = '08 - Comercial',
    Pesquisa = '09 - Pesquisa',
    EducacaoCentroDeTreinamento = '10 - Educação Centro de Treinamento',
    ColonizacaoAssentamento = '11 - Colonização/Assentamento',
    Readaptacao = '12 - Readaptação',
    Mineracao = '13 - Mineração',
    AreaIndigena = '14 - Área Indígena',
    UnidadeConservacaoAmbiental = '15 - Unidade de Conservação Ambiental',
    Armazenamento = '16 - Armazenamento',
    OleodutoGasoduto = '17 - Oleoduto/Gasoduto',
    FerroviaRodovia = '18 - Ferrovia/Rodovia',
    LinhaTransmissaoRepetidora = '19 - Linha de Transmissão/Estação Repetidora',
    TratamentoAguaEsgoto = '20 - Tratamento Água/Esgoto/Resíduo',
    BarragemRepresaAcude = '21 - Barragem/Represa/Açude',
    ExploracaoPetrolifera = '22 - Exploração Petrolífera',
    InfraestruturaAeroportuaria = '23 - Infra-Estrutura Aeroportuárea',
    EntidadeBancaria = '24 - Entidade Bancária',
    AreaUsoMilitar = '25 - Área de Uso Militar',
    Recreacao = '26 - Recreação',
    AssistencialHospitalar = '27 - Assistencial ou Hospitalar',
    Olaria = '28 - Olaria',
    OutraAtividade = '29 - Outra Atividade',
    Fomento = '30 - Fomento',
    SemDestinacao = '31 - Sem Destinação'
  }
  
  export enum Litigio {
    AreaComPosseiros = '09 - Área com Posseiros',
    Limite = '17 - Questão de Limite',
    Titulacao = '25 - Questão de Titulação',
    Posse = '25 - Questão quanto à Posse',
    PosseDominio = '41 - Questão quanto à Posse a ao Domínio',
    Dominio = '50 - Questão quanto ao Domínio',
    RestricaoAoUsoDaTerra = '68 - Questão de Restrição ao Uso da Terra',
    Servidao = '76 - Servidão do Acesso',
    ServidaoUsoAgua = '84 - Servidão do Uso da Água',
    Outras = '92 - Outras',
    Inexistente = '99 - Inexistente'
  }
  
  export enum UsoDaAgua {
    UsoHumano = 'Uso Humano',
    AplicacaoAgricola = 'Aplicação Agrícola',
    UsoHumanoAgricola = 'Uso Humano e Agrícola',
    UsoAnimal = 'Uso Animal',
    UsoHumanoAnimalAgricola = 'Uso Humano/Animal e Agrícola',
    UsoHumanoEAnimal = 'Uso Humano e Animal',
    UsoAnimalAgricola = 'Uso Animal e Agrícola',
    SemUso = 'Sem Uso'
  }
  
  export enum TipoEnergia {
    Solar = 'SOLAR',
    Eolica = 'EÓLICA'
  }
  
  export enum SituacaoJuridicaEnum {
    PossePorSimplesOcupacao = 'Posse Por Simples Ocupação',
    PosseJustoTitulo = 'Posse a Justo Título',
    Dominio = 'Área Registrada (Domínio)',
    Indefinido = 'Indefinido'
  }
  
  export enum FormaObtencaoEnum {
    AquisicaoGovEstadual = '01 - Aquisição do Governo Estadual',
    Adjudicacao = '02 - Adjudicação',
    AquisicaoGovFederal = '03 - Aquisição do Governo Federal'
  }

  