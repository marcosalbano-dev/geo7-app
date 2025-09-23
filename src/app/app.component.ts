import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';

// Angular Material (standalone)
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatNavList, MatListItem } from '@angular/material/list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, RouterLink, CommonModule,
    MatToolbarModule, MatIconModule, MatSidenavModule, MatSnackBarModule, MatButtonModule,
    MatNavList, MatListItem, 
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'geo7-app';

  // pode usar async em bindings NÃO-ação
  isHandset$: Observable<boolean>;

  // snapshot para usar dentro dos (click) sem pipe
  private isHandsetSnapshot = false;

  constructor(private bo: BreakpointObserver) {
    this.isHandset$ = this.bo.observe(Breakpoints.Handset).pipe(
      map(r => r.matches),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    // mantém snapshot sempre atualizado
    this.isHandset$.subscribe(v => this.isHandsetSnapshot = v);
  }

  closeIfHandset(drawer: MatSidenav) {
    if (this.isHandsetSnapshot) drawer.close();
  }
}
