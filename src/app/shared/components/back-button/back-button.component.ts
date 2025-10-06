import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-back-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <button 
      mat-button 
      [color]="color"
      [class]="buttonClass"
      (click)="onBackClick()"
      [disabled]="disabled">
      <mat-icon [fontIcon]="icon"></mat-icon>
      <span *ngIf="showText" class="ml-5">{{ text }}</span>
    </button>
  `,
  styles: [`
    .ml-5 {
      margin-left: 5px;
    }
  `]
})
export class BackButtonComponent {
  @Input() text = 'Voltar';
  @Input() showText = true;
  @Input() icon = 'arrow_back';
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
  @Input() buttonClass = '';
  @Input() disabled = false;
  @Input() route?: string; // Rota específica para navegar
  @Input() useHistory = true; // Se deve usar o histórico do browser
  @Input() queryParams?: any; // Parâmetros de query para a rota

  @Output() backClick = new EventEmitter<void>();

  constructor(
    private location: Location,
    private router: Router
  ) {}

  onBackClick(): void {
    this.backClick.emit();

    if (this.route) {
      // Navega para uma rota específica
      this.router.navigate([this.route], { queryParams: this.queryParams });
    } else if (this.useHistory) {
      // Usa o histórico do browser para voltar
      this.location.back();
    }
  }
}
