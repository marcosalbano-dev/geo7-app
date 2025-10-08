import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-landingpage',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.scss'
})
export class LandingpageComponent {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  // Método para navegar para o login
  irParaLogin() {
    this.router.navigate(['/login']);
  }

  // Método para entrar no sistema (se já estiver logado)
  entrarNoSistema() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/consulta-lotes']);
    } else {
      this.irParaLogin();
    }
  }
}
