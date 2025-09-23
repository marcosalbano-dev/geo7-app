import { Component, Input, Output, EventEmitter, TemplateRef, ContentChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';

export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  template?: TemplateRef<any>;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  template: `
    <div class="data-table-container">
      <mat-table 
        [dataSource]="data" 
        matSort
        #sort="matSort"
        class="data-table">
        
        <!-- Action Column -->
        <ng-container *ngIf="showActions" matColumnDef="actions">
          <mat-header-cell *matHeaderCellDef>Ações</mat-header-cell>
          <mat-cell *matCellDef="let row; let i = index">
            <ng-container *ngIf="actionsTemplate; else defaultActions">
              <ng-container *ngTemplateOutlet="actionsTemplate; context: { $implicit: row, index: i }"></ng-container>
            </ng-container>
            
            <ng-template #defaultActions>
              <button 
                *ngIf="showEditButton"
                mat-icon-button
                color="primary"
                (click)="onEdit(row, i)"
                matTooltip="Editar">
                <mat-icon>edit</mat-icon>
              </button>
              
              <button 
                *ngIf="showDeleteButton"
                mat-icon-button
                color="warn"
                (click)="onDelete(row, i)"
                matTooltip="Excluir">
                <mat-icon>delete</mat-icon>
              </button>
            </ng-template>
          </mat-cell>
        </ng-container>
        
        <!-- Data Columns -->
        <ng-container *ngFor="let column of columns" [matColumnDef]="column.key">
          <mat-header-cell *matHeaderCellDef [mat-sort-header]="column.sortable ? column.key : ''">
            {{ column.label }}
          </mat-header-cell>
          <mat-cell *matCellDef="let row">
            <ng-container *ngIf="column.template; else defaultCell">
              <ng-container *ngTemplateOutlet="column.template; context: { $implicit: row[column.key], row: row }"></ng-container>
            </ng-container>
            
            <ng-template #defaultCell>
              {{ row[column.key] }}
            </ng-template>
          </mat-cell>
        </ng-container>
        
        <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
        <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
        
        <!-- No Data Row -->
        <tr class="mat-row" *matNoDataRow>
          <td class="mat-cell" [attr.colspan]="displayedColumns.length">
            <div class="no-data">
              <mat-icon>inbox</mat-icon>
              <p>Nenhum dado encontrado</p>
            </div>
          </td>
        </tr>
      </mat-table>
      
      <mat-paginator
        *ngIf="showPaginator"
        [length]="totalItems"
        [pageSize]="pageSize"
        [pageSizeOptions]="pageSizeOptions"
        [showFirstLastButtons]="true"
        (page)="onPageChange($event)">
      </mat-paginator>
    </div>
  `,
  styles: [`
    .data-table-container {
      width: 100%;
      overflow-x: auto;
    }
    
    .data-table {
      width: 100%;
    }
    
    .no-data {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-xl);
      color: var(--color-text-secondary);
    }
    
    .no-data mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: var(--spacing-md);
    }
    
    .no-data p {
      margin: 0;
      font-size: var(--font-size-sm);
    }
  `]
})
export class DataTableComponent {
  @Input() data: any[] = [];
  @Input() columns: Column[] = [];
  @Input() showActions = false;
  @Input() showEditButton = true;
  @Input() showDeleteButton = true;
  @Input() showPaginator = true;
  @Input() totalItems = 0;
  @Input() pageSize = 10;
  @Input() pageSizeOptions = [5, 10, 25, 50];
  @Input() actionsTemplate?: TemplateRef<any>;
  @Input() sort?: any;

  @Output() edit = new EventEmitter<{ row: any; index: number }>();
  @Output() delete = new EventEmitter<{ row: any; index: number }>();
  @Output() pageChange = new EventEmitter<PageEvent>();
  @Output() sortChange = new EventEmitter<Sort>();

  get displayedColumns(): string[] {
    const cols = this.columns.map(c => c.key);
    if (this.showActions) {
      cols.push('actions');
    }
    return cols;
  }

  onEdit(row: any, index: number): void {
    this.edit.emit({ row, index });
  }

  onDelete(row: any, index: number): void {
    this.delete.emit({ row, index });
  }

  onPageChange(event: PageEvent): void {
    this.pageChange.emit(event);
  }
}
