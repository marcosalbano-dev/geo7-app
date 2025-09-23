import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';

export type FieldType = 'text' | 'email' | 'number' | 'tel' | 'date' | 'select' | 'textarea';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <mat-form-field 
      [class]="fieldClass"
      [appearance]="appearance"
      [floatLabel]="floatLabel">
      
      <mat-label *ngIf="label">{{ label }}</mat-label>
      
      <!-- Text Input -->
      <input 
        *ngIf="type === 'text' || type === 'email' || type === 'tel'"
        matInput
        [type]="type!"
        [placeholder]="placeholder || ''"
        [disabled]="disabled"
        [readonly]="readonly"
        [value]="value || ''"
        (input)="onInput($event)"
        (blur)="onBlur()"
        [attr.maxlength]="maxLength"
        [attr.minlength]="minLength">
      
      <!-- Number Input -->
      <input 
        *ngIf="type === 'number'"
        matInput
        type="number"
        [placeholder]="placeholder || ''"
        [disabled]="disabled"
        [readonly]="readonly"
        [value]="value"
        (input)="onInput($event)"
        (blur)="onBlur()"
        [min]="min"
        [max]="max"
        [step]="step">
      
      <!-- Date Input -->
      <input 
        *ngIf="type === 'date'"
        matInput
        [matDatepicker]="picker"
        [placeholder]="placeholder || ''"
        [disabled]="disabled"
        [readonly]="readonly"
        [value]="value || ''"
        (dateInput)="onDateInput($event)"
        (blur)="onBlur()">
      <mat-datepicker-toggle *ngIf="type === 'date'" matSuffix [for]="picker"></mat-datepicker-toggle>
      <mat-datepicker #picker></mat-datepicker>
      
      <!-- Select Input -->
      <mat-select 
        *ngIf="type === 'select'"
        [placeholder]="placeholder || ''"
        [disabled]="disabled"
        [value]="value"
        (selectionChange)="onSelectChange($event)"
        (blur)="onBlur()">
        <mat-option *ngFor="let option of options" [value]="option.value">
          {{ option.label }}
        </mat-option>
      </mat-select>
      
      <!-- Textarea -->
      <textarea 
        *ngIf="type === 'textarea'"
        matInput
        [placeholder]="placeholder || ''"
        [disabled]="disabled"
        [readonly]="readonly"
        [value]="value || ''"
        (input)="onInput($event)"
        (blur)="onBlur()"
        [rows]="rows"
        [attr.maxlength]="maxLength"
        [attr.minlength]="minLength"></textarea>
      
      <mat-hint *ngIf="hint" align="start">{{ hint }}</mat-hint>
      <mat-error *ngIf="error">{{ error }}</mat-error>
    </mat-form-field>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormFieldComponent),
      multi: true
    }
  ]
})
export class FormFieldComponent implements ControlValueAccessor {
  @Input() type: FieldType = 'text';
  @Input() label?: string;
  @Input() placeholder?: string;
  @Input() hint?: string;
  @Input() error?: string;
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() required = false;
  @Input() appearance: 'fill' | 'outline' = 'outline';
  @Input() floatLabel: 'always' | 'auto' = 'auto';
  @Input() fieldClass = '';
  @Input() maxLength?: number;
  @Input() minLength?: number;
  @Input() min?: number;
  @Input() max?: number;
  @Input() step?: number;
  @Input() rows?: number;
  @Input() options: { value: any; label: string }[] = [];

  value: any = '';
  onChange = (value: any) => {};
  onTouched = () => {};

  onInput(event: any) {
    this.value = event.target.value;
    this.onChange(this.value);
  }

  onDateInput(event: any) {
    this.value = event.value;
    this.onChange(this.value);
  }

  onSelectChange(event: any) {
    this.value = event.value;
    this.onChange(this.value);
  }

  onBlur() {
    this.onTouched();
  }

  writeValue(value: any): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
