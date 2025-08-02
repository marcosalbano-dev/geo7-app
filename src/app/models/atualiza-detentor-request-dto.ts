import { PessoaDTO } from './pessoa.dto';
import { PessoaLoteDTO } from './pessoa-lote.dto';
import { EnderecoPessoaDTO } from './endereco-pessoa-dto';
import { DocumentoPessoaDTO } from './documento-pessoa-dto';

export interface AtualizaDetentorRequestDTO {
  pessoa: PessoaDTO;
  pessoaLote: PessoaLoteDTO;
  endereco: EnderecoPessoaDTO;
  documento: DocumentoPessoaDTO;
}
