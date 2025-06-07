import { EstruturaDTO } from "./estrutura.dto";

export interface EstruturaCreateDTO extends Omit<EstruturaDTO, 'id' | 'dhc' | 'dhm' | 'ativo'> {}