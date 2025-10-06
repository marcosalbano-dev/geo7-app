import { Component, Input, ContentChild, TemplateRef } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <mat-card [class]="cardClass">
      <mat-card-header *ngIf="title || subtitle">
        <mat-card-title>{{ title }}</mat-card-title>
        <mat-card-subtitle *ngIf="subtitle">{{ subtitle }}</mat-card-subtitle>
      </mat-card-header>
      
      <mat-card-content>
        <ng-content></ng-content>
      </mat-card-content>
      
      <mat-card-actions *ngIf="showActions" align="end">
        <ng-container *ngIf="actionsTemplate; else defaultActions">
          <ng-container *ngTemplateOutlet="actionsTemplate"></ng-container>
        </ng-container>
        
        <ng-template #defaultActions>
          <button 
            *ngIf="showSaveButton"
            mat-raised-button 
            color="primary"
            [disabled]="saveDisabled"
            (click)="onSave()">
            <mat-icon>save</mat-icon>
            Salvar
          </button>
          
          <button 
            *ngIf="showCancelButton"
            mat-button
            (click)="onCancel()">
            <mat-icon>cancel</mat-icon>
            Cancelar
          </button>
          
          <button 
            *ngIf="showEditButton"
            mat-button
            color="primary"
            (click)="onEdit()">
            <mat-icon>edit</mat-icon>
            Editar
          </button>
          
          <button 
            *ngIf="showDeleteButton"
            mat-button
            color="warn"
            (click)="onDelete()">
            <mat-icon>delete</mat-icon>
            Excluir
          </button>
        </ng-template>
      </mat-card-actions>
    </mat-card>
  `
})
export class CardComponent {
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() cardClass = '';
  @Input() showActions = false;
  @Input() showSaveButton = false;
  @Input() showCancelButton = false;
  @Input() showEditButton = false;
  @Input() showDeleteButton = false;
  @Input() saveDisabled = false;
  @ContentChild('actions') actionsTemplate?: TemplateRef<any>;

  onSave() {
    // Emitir evento ou chamar callback
  }

  onCancel() {
    // Emitir evento ou chamar callback
  }

  onEdit() {
    // Emitir evento ou chamar callback
  }

  onDelete() {
    // Emitir evento ou chamar callback
  }
}
