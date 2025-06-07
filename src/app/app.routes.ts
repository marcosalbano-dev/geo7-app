import { Routes } from '@angular/router';
import { CadastroEstruturaComponent } from './cadastro-estrutura/cadastro-estrutura.component';
import { CadastroLotesComponent } from './cadastro-lotes/cadastro-lotes.component';
import { CadastroUsoComponent } from './cadastro-uso/cadastro-uso.component';
import { CadastroPessoasComponent } from './cadastro-pessoas/cadastro-pessoas.component';
import { ConsultaLotesComponent } from './consulta-lotes/consulta-lotes.component';
import { CadastroSituacaoJuridicaComponent } from './cadastro-situacao-juridica/cadastro-situacao-juridica.component';
import { CadastroEnderecoLoteComponent } from './cadastro-endereco-lote/cadastro-endereco-lote.component';

export const routes: Routes = [
    { path: 'cadastro-endereco-lote', component: CadastroEnderecoLoteComponent },
    { path: 'cadastro-estrutura', component: CadastroEstruturaComponent },
    { path: 'cadastro-lotes', component: CadastroLotesComponent },
    { path: 'cadastro-uso', component: CadastroUsoComponent },
    { path: 'cadastro-pessoas', component: CadastroPessoasComponent },
    { path: 'cadastro-situacao-juridica', component: CadastroSituacaoJuridicaComponent },
    { path: 'consulta-lotes', component: ConsultaLotesComponent }
];
