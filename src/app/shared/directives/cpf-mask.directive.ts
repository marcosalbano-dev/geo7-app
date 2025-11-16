import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appCpfMask]',
  standalone: true
})
export class CpfMaskDirective implements OnInit {

  constructor(
    private el: ElementRef<HTMLInputElement>,
    private control: NgControl
  ) {}

  ngOnInit(): void {
    // Aplica a máscara no valor inicial se existir
    if (this.control.control) {
      // Observa mudanças no valor do formulário para aplicar máscara
      this.control.control.valueChanges.subscribe((value) => {
        // Evita loop infinito: só aplica se o valor do input for diferente
        const currentInputValue = this.el.nativeElement.value.replace(/\D/g, '');
        const formValue = value ? value.toString().replace(/\D/g, '') : '';
        
        if (currentInputValue !== formValue) {
          if (value && typeof value === 'string') {
            const numericValue = value.replace(/\D/g, '');
            if (numericValue.length <= 11) {
              const maskedValue = this.formatCpf(numericValue);
              this.applyMask(maskedValue);
            }
          } else if (value && typeof value === 'number') {
            const numericValue = value.toString().replace(/\D/g, '');
            if (numericValue.length <= 11) {
              const maskedValue = this.formatCpf(numericValue);
              this.applyMask(maskedValue);
            }
          }
        }
      });
      
      // Aplica máscara no valor inicial
      setTimeout(() => {
        const initialValue = this.control.control?.value;
        if (initialValue) {
          const valueStr = initialValue.toString().replace(/\D/g, '');
          if (valueStr.length <= 11) {
            const maskedValue = this.formatCpf(valueStr);
            this.applyMask(maskedValue);
          }
        }
      }, 0);
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // Remove tudo que não é dígito
    
    if (value.length <= 11) {
      const maskedValue = this.formatCpf(value);
      
      // Atualiza o valor do formulário com apenas números (sem máscara)
      if (this.control.control) {
        this.control.control.setValue(value, { emitEvent: false });
      }
      
      // Aplica a máscara visual no input
      this.applyMask(maskedValue);
    } else {
      // Se exceder 11 dígitos, mantém apenas os primeiros 11
      value = value.substring(0, 11);
      const maskedValue = this.formatCpf(value);
      this.applyMask(maskedValue);
      if (this.control.control) {
        this.control.control.setValue(value, { emitEvent: false });
      }
    }
  }

  @HostListener('blur', ['$event'])
  onBlur(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '');
    
    if (value.length === 11) {
      const maskedValue = this.formatCpf(value);
      this.applyMask(maskedValue);
    }
  }

  private formatCpf(value: string): string {
    if (value.length <= 3) {
      return value;
    } else if (value.length <= 6) {
      return value.replace(/(\d{3})(\d+)/, '$1.$2');
    } else if (value.length <= 9) {
      return value.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
    } else {
      return value.replace(/(\d{3})(\d{3})(\d{3})(\d+)/, '$1.$2.$3-$4');
    }
  }

  private applyMask(value: string): void {
    this.el.nativeElement.value = value;
  }
}

