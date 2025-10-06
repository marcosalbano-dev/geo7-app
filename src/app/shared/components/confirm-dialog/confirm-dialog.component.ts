import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'warning' | 'error' | 'success';
  showCancel?: boolean;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="confirm-dialog">
      <h2 mat-dialog-title [class]="titleClass">
        <mat-icon [class]="iconClass">{{ icon }}</mat-icon>
        {{ data.title }}
      </h2>
      
      <mat-dialog-content>
        <p>{{ data.message }}</p>
      </mat-dialog-content>
      
      <mat-dialog-actions align="end">
        <button 
          *ngIf="data.showCancel !== false"
          mat-button 
          (click)="onCancel()">
          {{ data.cancelText || 'Cancelar' }}
        </button>
        
        <button 
          mat-raised-button 
          [color]="buttonColor"
          (click)="onConfirm()">
          {{ data.confirmText || 'Confirmar' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .confirm-dialog {
      min-width: 300px;
    }
    
    .confirm-dialog h2 {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      margin: 0;
    }
    
    .confirm-dialog mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }
    
    .title-info { color: var(--color-info-600); }
    .title-warning { color: var(--color-warning-600); }
    .title-error { color: var(--color-error-600); }
    .title-success { color: var(--color-success-600); }
    
    .icon-info { color: var(--color-info-500); }
    .icon-warning { color: var(--color-warning-500); }
    .icon-error { color: var(--color-error-500); }
    .icon-success { color: var(--color-success-500); }
  `]
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}

  get icon(): string {
    switch (this.data.type) {
      case 'info': return 'info';
      case 'warning': return 'warning';
      case 'error': return 'error';
      case 'success': return 'check_circle';
      default: return 'help';
    }
  }

  get titleClass(): string {
    return `title-${this.data.type || 'info'}`;
  }

  get iconClass(): string {
    return `icon-${this.data.type || 'info'}`;
  }

  get buttonColor(): 'primary' | 'accent' | 'warn' {
    switch (this.data.type) {
      case 'error': return 'warn';
      case 'success': return 'primary';
      default: return 'primary';
    }
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
