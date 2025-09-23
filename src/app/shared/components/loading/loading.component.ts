import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatProgressBarModule],
  template: `
    <div class="loading-container" [class]="containerClass">
      <div *ngIf="type === 'spinner'" class="loading-spinner">
        <mat-spinner [diameter]="size" [color]="color"></mat-spinner>
        <p *ngIf="message" class="loading-message">{{ message }}</p>
      </div>
      
      <div *ngIf="type === 'bar'" class="loading-bar">
        <mat-progress-bar 
          [mode]="mode" 
          [value]="value" 
          [color]="color">
        </mat-progress-bar>
        <p *ngIf="message" class="loading-message">{{ message }}</p>
      </div>
      
      <div *ngIf="type === 'overlay'" class="loading-overlay">
        <div class="loading-content">
          <mat-spinner [diameter]="size" [color]="color"></mat-spinner>
          <p *ngIf="message" class="loading-message">{{ message }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .loading-spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-md);
    }
    
    .loading-bar {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }
    
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: var(--z-index-overlay);
    }
    
    .loading-content {
      background: white;
      padding: var(--spacing-xl);
      border-radius: var(--radius-md);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-md);
    }
    
    .loading-message {
      margin: 0;
      color: var(--color-text-secondary);
      font-size: var(--font-size-sm);
    }
  `]
})
export class LoadingComponent {
  @Input() type: 'spinner' | 'bar' | 'overlay' = 'spinner';
  @Input() message?: string;
  @Input() size = 40;
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
  @Input() mode: 'determinate' | 'indeterminate' | 'buffer' | 'query' = 'indeterminate';
  @Input() value?: number;
  @Input() containerClass = '';
}
