import { Routes } from '@angular/router';
import { CadastroEstruturaComponent } from './cadastro-estrutura/cadastro-estrutura.component';
import { CadastroLotesComponent } from './cadastro-lotes/cadastro-lotes.component';
import { CadastroDadosSobreUsoComponent } from './cadastro-dados-sobre-uso/cadastro-dados-sobre-uso.component';
import { CadastroPessoasComponent } from './cadastro-pessoas/cadastro-pessoas.component';
import { ConsultaLotesComponent } from './consulta-lotes/consulta-lotes.component';
import { CadastroSituacaoJuridicaComponent } from './cadastro-situacao-juridica/cadastro-situacao-juridica.component';
import { CadastroEnderecoLoteComponent } from './cadastro-endereco-lote/cadastro-endereco-lote.component';
import { CadastroMunicipioComponent } from './cadastro-municipio/cadastro-municipio.component';
import { CadastroPessoaLoteComponent } from './cadastro-pessoa-lote/cadastro-pessoa-lote.component';
import { CadastroUsuarioComponent } from './cadastro-usuario/cadastro-usuario.component';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
    // Rota padrão - redireciona para landingpage
    { path: '', redirectTo: '/landingpage', pathMatch: 'full' },
    
    // Página inicial (pública)
    { path: 'landingpage', component: LandingpageComponent },
    
    // Login (pública)
    { path: 'login', component: LoginComponent },
    
    // Rotas protegidas do sistema
    { path: 'cadastro-endereco-lote', component: CadastroEnderecoLoteComponent, canActivate: [AuthGuard] },
    { path: 'cadastro-estrutura', component: CadastroEstruturaComponent, canActivate: [AuthGuard] },
    { path: 'cadastro-lotes', component: CadastroLotesComponent, canActivate: [AuthGuard] },
    { path: 'cadastro-dados-sobre-uso', component: CadastroDadosSobreUsoComponent, canActivate: [AuthGuard] },
    { path: 'cadastro-pessoas', component: CadastroPessoasComponent, canActivate: [AuthGuard] },
    { path: 'cadastro-situacao-juridica', component: CadastroSituacaoJuridicaComponent, canActivate: [AuthGuard] },
    { path: 'consulta-lotes', component: ConsultaLotesComponent, canActivate: [AuthGuard] },
    { path: 'cadastro-municipio', component: CadastroMunicipioComponent, canActivate: [AuthGuard] },
    { path: 'cadastro-pessoa-lote', component: CadastroPessoaLoteComponent, canActivate: [AuthGuard] },
    { path: 'cadastro-usuario', component: CadastroUsuarioComponent, canActivate: [AdminGuard] },
    
    // Rota wildcard - redireciona para landingpage se a rota não existir
    { path: '**', redirectTo: '/landingpage' }
];
