import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appSncrMask]',
  standalone: true
})
export class SncrMaskDirective implements OnInit {

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
            let numericValue = value.replace(/\D/g, '');
            // Limita a 13 dígitos
            if (numericValue.length > 13) {
              numericValue = numericValue.substring(0, 13);
            }
            if (numericValue.length <= 13) {
              const maskedValue = this.formatSncr(numericValue);
              this.applyMask(maskedValue);
            }
          } else if (value && typeof value === 'number') {
            let numericValue = value.toString().replace(/\D/g, '');
            // Limita a 13 dígitos
            if (numericValue.length > 13) {
              numericValue = numericValue.substring(0, 13);
            }
            if (numericValue.length <= 13) {
              const maskedValue = this.formatSncr(numericValue);
              this.applyMask(maskedValue);
            }
          }
        }
      });
      
      // Aplica máscara no valor inicial
      setTimeout(() => {
        const initialValue = this.control.control?.value;
        if (initialValue) {
          let valueStr = initialValue.toString().replace(/\D/g, '');
          // Limita a 13 dígitos
          if (valueStr.length > 13) {
            valueStr = valueStr.substring(0, 13);
          }
          if (valueStr.length <= 13) {
            const maskedValue = this.formatSncr(valueStr);
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
    
    // SNCR tem 13 dígitos no formato: 951.099.138.622-0
    if (value.length <= 13) {
      const maskedValue = this.formatSncr(value);
      
      // Atualiza o valor do formulário com apenas números (sem máscara)
      if (this.control.control) {
        this.control.control.setValue(value, { emitEvent: false });
      }
      
      // Aplica a máscara visual no input
      this.applyMask(maskedValue);
    } else {
      // Se exceder 13 dígitos, mantém apenas os primeiros 13
      value = value.substring(0, 13);
      const maskedValue = this.formatSncr(value);
      this.applyMask(maskedValue);
      if (this.control.control) {
        this.control.control.setValue(value, { emitEvent: false });
      }
    }
  }

  @HostListener('blur', ['$event'])
  onBlur(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    // Limita a 13 dígitos
    if (value.length > 13) {
      value = value.substring(0, 13);
    }
    const maskedValue = this.formatSncr(value);
    this.applyMask(maskedValue);
  }

  private formatSncr(value: string): string {
    // Formato: 951.099.138.622-0 (3 dígitos, ponto, 3 dígitos, ponto, 3 dígitos, ponto, 3 dígitos, hífen, 1 dígito)
    if (value.length <= 3) {
      return value;
    } else if (value.length <= 6) {
      return value.replace(/(\d{3})(\d+)/, '$1.$2');
    } else if (value.length <= 9) {
      return value.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
    } else if (value.length <= 12) {
      return value.replace(/(\d{3})(\d{3})(\d{3})(\d+)/, '$1.$2.$3.$4');
    } else {
      // Formato completo: 951.099.138.622-0
      return value.replace(/(\d{3})(\d{3})(\d{3})(\d{3})(\d+)/, '$1.$2.$3.$4-$5');
    }
  }

  private applyMask(value: string): void {
    this.el.nativeElement.value = value;
  }
}

