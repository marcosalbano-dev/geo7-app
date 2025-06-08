import { Municipio } from '../models/municipio';

export class Distrito{

    id!: number;
    codigoDistrito: string = '';
    nomeDistrito: string = '';
    municipios: Municipio[] = [];

    constructor() {}

    setNome(nome: string): void {
        this.nomeDistrito = this.nomeDistrito?.toUpperCase() ?? '';
      }


    
   


  

  }