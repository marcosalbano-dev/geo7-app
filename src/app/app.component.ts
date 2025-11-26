import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay, filter, takeUntil } from 'rxjs/operators';
import { Observable, Subject, combineLatest } from 'rxjs';
import { AuthService } from './services/auth.service';
import { NavigationStateService } from './services/navigation-state.service';

// Angular Material (standalone)
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatNavList, MatListItem } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, RouterLink, CommonModule,
    MatToolbarModule, MatIconModule, MatSidenavModule, MatSnackBarModule, MatButtonModule,
    MatNavList, MatListItem, MatMenuModule, MatDividerModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  title = 'geo7-app';

  // pode usar async em bindings NÃO-ação
  isHandset$: Observable<boolean>;
  
  // Controla se deve mostrar o layout completo ou apenas o conteúdo
  showFullLayout = false; // Inicializa como false para evitar flash
  isLandingPage = true; // Flag adicional para controle mais preciso

  // Estado para controlar visibilidade dos links
  municipioIdSelecionado$: Observable<number | null>;
  loteIdSelecionado$: Observable<number | null>;
  showNavigationLinks$: Observable<boolean>;

  // snapshot para usar dentro dos (click) sem pipe
  private isHandsetSnapshot = false;
  private destroy$ = new Subject<void>();

  constructor(
    private bo: BreakpointObserver, 
    private router: Router, 
    private authService: AuthService,
    private navigationStateService: NavigationStateService
  ) {
    this.isHandset$ = this.bo.observe(Breakpoints.Handset).pipe(
      map(r => r.matches),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    // mantém snapshot sempre atualizado
    this.isHandset$.pipe(takeUntil(this.destroy$)).subscribe(v => this.isHandsetSnapshot = v);
    
    // Força a detecção inicial da rota
    this.updateLayoutBasedOnRoute(this.router.url);

    // Inicializa observables do estado de navegação
    this.municipioIdSelecionado$ = this.navigationStateService.getMunicipioId();
    this.loteIdSelecionado$ = this.navigationStateService.getLoteId();
    
    // Mostra links de navegação apenas quando há município selecionado
    this.showNavigationLinks$ = this.municipioIdSelecionado$.pipe(
      map(municipioId => municipioId !== null && municipioId !== undefined)
    );
  }

  ngOnInit(): void {
    // Monitora mudanças de rota para controlar o layout
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe((event: NavigationEnd) => {
      this.updateLayoutBasedOnRoute(event.url);
    });
  }

  ngAfterViewInit(): void {
    // Garante que a inicialização aconteça após a view estar completamente renderizada
    this.forceLayoutUpdate();
  }

  private forceLayoutUpdate(): void {
    // Múltiplas tentativas para garantir que funcione
    setTimeout(() => {
      this.updateLayoutBasedOnRoute(this.router.url);
    }, 0);
    
    setTimeout(() => {
      this.updateLayoutBasedOnRoute(this.router.url);
    }, 50);
    
    setTimeout(() => {
      this.updateLayoutBasedOnRoute(this.router.url);
    }, 100);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateLayoutBasedOnRoute(url: string): void {
    this.isLandingPage = url.includes('/landingpage') || url === '/' || url === '';
    const isLoginPage = url.includes('/login');
    const isCadastroUsuarioPage = url.includes('/cadastro-usuario');
    
    this.showFullLayout = !this.isLandingPage && !isLoginPage && !isCadastroUsuarioPage;
  }

  closeIfHandset(drawer: MatSidenav) {
    if (this.isHandsetSnapshot) drawer.close();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  getCurrentUser() {
    return this.authService.getCurrentUser();
  }

  getShortUserName(): string {
    const user = this.getCurrentUser();
    if (!user) return 'Usuário';
    
    const name = user.name;
    
    // Se for "Administrador do Sistema", mostra apenas "Admin"
    if (name.toLowerCase().includes('administrador')) {
      return 'Admin';
    }
    
    // Se for muito longo, pega apenas o primeiro nome
    if (name.length <= 12) return name;
    
    const firstName = name.split(' ')[0];
    return firstName.length <= 12 ? firstName : firstName.substring(0, 10) + '...';
  }

  logout(): void {
    this.authService.logout();
  }

  // Método para obter query params como objeto para routerLink
  getQueryParams(): { loteId?: number } {
    const loteId = this.navigationStateService.getLoteIdValue();
    return loteId ? { loteId } : {};
  }
}
