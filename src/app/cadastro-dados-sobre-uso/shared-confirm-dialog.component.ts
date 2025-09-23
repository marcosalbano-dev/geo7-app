import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  template: `
<h3 style="margin:0">{{ data?.title || 'Confirmar' }}</h3>
<p>{{ data?.message || 'Tem certeza?' }}</p>
<div style="display:flex; justify-content:flex-end; gap:8px">
  <button mat-stroked-button (click)="ref.close(false)">Cancelar</button>
  <button mat-flat-button color="warn" (click)="ref.close(true)">Remover</button>
</div>
  `
})
export class ConfirmDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public ref: MatDialogRef<ConfirmDialogComponent>
  ) {}
}
