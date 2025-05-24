import { Routes } from '@angular/router';
import { CadastroEstruturaComponent } from './cadastro-estrutura/cadastro-estrutura.component';
import { CadastroLotesComponent } from './cadastro-lotes/cadastro-lotes.component';
import { CadastroUsoComponent } from './cadastro-uso/cadastro-uso.component';
import { CadastroPessoasComponent } from './cadastro-pessoas/cadastro-pessoas.component';
import { ConsultaLotesComponent } from './consulta-lotes/consulta-lotes.component';

export const routes: Routes = [
    { path: 'cadastro-estrutura', component: CadastroEstruturaComponent },
    { path: 'cadastro-lotes', component: CadastroLotesComponent },
    { path: 'cadastro-uso', component: CadastroUsoComponent },
    { path: 'cadastro-pessoas', component: CadastroPessoasComponent },
    { path: 'consulta-lotes', component: ConsultaLotesComponent }
];
