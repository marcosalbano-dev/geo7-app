import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appAreaMask]',
  standalone: true
})
export class AreaMaskDirective implements OnInit {
  @Input() decimals: number = 10; // Número máximo de casas decimais (permite mais de 4 como no Groovy)
  private defaultDecimals: number = 4; // Casas decimais padrão para exibição inicial

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
        const currentInputValue = this.el.nativeElement.value.replace(/[^\d.]/g, '');
        const formValue = value !== null && value !== undefined ? value.toString().replace(/[^\d.]/g, '') : '';
        
        if (currentInputValue !== formValue) {
          if (value !== null && value !== undefined) {
            const formattedValue = this.formatArea(value);
            this.applyMask(formattedValue);
            // Reposiciona cursor no final
            setTimeout(() => {
              this.el.nativeElement.setSelectionRange(formattedValue.length, formattedValue.length);
            }, 0);
          } else {
            // Se o valor for null/undefined, inicializa com 0.0000
            const defaultValue = '0.' + '0'.repeat(this.defaultDecimals);
            this.applyMask(defaultValue);
            setTimeout(() => {
              this.el.nativeElement.setSelectionRange(defaultValue.length, defaultValue.length);
            }, 0);
          }
        }
      });
      
      // Aplica máscara no valor inicial
      setTimeout(() => {
        const initialValue = this.control.control?.value;
        if (initialValue !== null && initialValue !== undefined) {
          const formattedValue = this.formatArea(initialValue);
          this.applyMask(formattedValue);
          // Salva o valor inicial para comparação
          this.el.nativeElement.setAttribute('data-previous-value', formattedValue);
          // Reposiciona cursor no final
          this.el.nativeElement.setSelectionRange(formattedValue.length, formattedValue.length);
        } else {
          // Se não houver valor inicial, inicializa com 0.0000
          const defaultValue = '0.' + '0'.repeat(this.defaultDecimals);
          this.applyMask(defaultValue);
          // Salva o valor inicial para comparação
          this.el.nativeElement.setAttribute('data-previous-value', defaultValue);
          this.el.nativeElement.setSelectionRange(defaultValue.length, defaultValue.length);
        }
      }, 0);
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const previousValue = this.el.nativeElement.getAttribute('data-previous-value') || '0.0000';
    const rawValue = input.value;
    
    // Detecta o que foi digitado comparando com o valor anterior
    const previousNumeric = previousValue.replace(/[^\d]/g, '');
    const currentNumeric = rawValue.replace(/[^\d]/g, '');
    
    let value: string;
    
    // Se o novo valor tem mais dígitos, significa que algo foi digitado
    if (currentNumeric.length > previousNumeric.length) {
      // Pega apenas o último dígito digitado (o mais recente)
      const newDigit = currentNumeric[currentNumeric.length - 1];
      
      // Sempre desloca os dígitos da direita para esquerda (comportamento do Groovy)
      value = this.shiftDigitsLeft(previousValue, newDigit);
    } else if (currentNumeric.length < previousNumeric.length) {
      // Se removeu dígitos, processa normalmente
      let cleanValue = rawValue.replace(/[^\d.]/g, '');
      if (cleanValue === '' || cleanValue === '0') {
        cleanValue = '0.0000';
      }
      
      const parts = cleanValue.split('.');
      let integerPart = parts[0] || '0';
      let decimalPart = parts[1] || '';
      
      if (parts.length > 2) {
        integerPart = parts[0] || '0';
        decimalPart = parts.slice(1).join('');
      }
      
      if (integerPart === '') {
        integerPart = '0';
      }
      
      if (decimalPart.length > this.decimals) {
        decimalPart = decimalPart.substring(0, this.decimals);
      }
      
      if (decimalPart === '' && integerPart === '0') {
        decimalPart = '0'.repeat(this.defaultDecimals);
      }
      
      value = integerPart + '.' + decimalPart;
    } else {
      // Se não mudou o número de dígitos, mantém o valor anterior
      value = previousValue;
    }
    
    // Salva o valor atual para próxima comparação
    this.el.nativeElement.setAttribute('data-previous-value', value);
    
    // Formata para exibição - durante digitação, não preenche zeros automaticamente
    // Se tem mais de 4 casas decimais, mostra todas; se tem 4 ou menos, mostra como está (sem preencher)
    const parts = value.split('.');
    let integerPart = parts[0] || '0';
    let decimalPart = parts[1] || '';
    
    // Se não tem parte decimal e é zero, mostra 0.0000
    if (decimalPart === '' && integerPart === '0') {
      decimalPart = '0'.repeat(this.defaultDecimals);
    }
    
    // Durante digitação, mostra exatamente como está (sem preencher zeros)
    // Se tem mais de 4 casas, mostra todas; se tem 4 ou menos, mostra como está
    const formattedValue = decimalPart ? integerPart + '.' + decimalPart : integerPart + '.' + '0'.repeat(this.defaultDecimals);
    
    // Atualiza o valor do formulário (número puro)
    if (this.control.control) {
      const numericValueForForm = parseFloat(value);
      this.control.control.setValue(numericValueForForm, { emitEvent: false });
    }
    
    // Aplica a máscara visual no input
    this.applyMask(formattedValue);
    
    // Reposiciona o cursor no final após aplicar a máscara
    setTimeout(() => {
      input.setSelectionRange(formattedValue.length, formattedValue.length);
    }, 0);
  }
  
  private shiftDigitsLeft(currentValue: string, newDigit: string): string {
    // Remove todos os não-dígitos para trabalhar apenas com números
    const allDigits = currentValue.replace(/[^\d]/g, '');
    
    // Converte para array para facilitar manipulação
    const digitsArray = allDigits.split('');
    
    // Desloca todos os dígitos uma posição para a esquerda e adiciona o novo dígito no final
    // Exemplo: 0.0000 (00000) -> digita 1 -> 00001 -> 0.0001
    //          0.0001 (00001) -> digita 2 -> 00012 -> 0.0012
    //          0.0012 (00012) -> digita 3 -> 00123 -> 0.0123
    //          0.0123 (00123) -> digita 4 -> 01234 -> 0.1234
    //          0.1234 (01234) -> digita 5 -> 12345 -> 1.2345
    if (digitsArray.length > 0) {
      // Remove o primeiro dígito (mais à esquerda)
      digitsArray.shift();
      // Adiciona o novo dígito no final
      digitsArray.push(newDigit);
    } else {
      digitsArray.push(newDigit);
    }
    
    // Reconstrói o número completo
    const newDigits = digitsArray.join('');
    
    // Separa parte inteira e decimal
    // Encontra onde está o ponto decimal no valor original para determinar quantos dígitos são decimais
    const originalParts = currentValue.split('.');
    const originalDecimalDigits = originalParts.length > 1 ? originalParts[1].replace(/[^\d]/g, '').length : this.defaultDecimals;
    
    // Se o valor original tinha ponto decimal
    if (currentValue.includes('.')) {
      // Se ainda temos o mesmo número de dígitos decimais (ou menos), mantém a estrutura
      if (newDigits.length <= originalDecimalDigits + 1) {
        // Se começou com 4 casas decimais e ainda tem 5 ou menos dígitos totais
        if (originalDecimalDigits === this.defaultDecimals && newDigits.length <= this.defaultDecimals + 1) {
          // Se tem exatamente 5 dígitos (1 inteiro + 4 decimais), separa normalmente
          if (newDigits.length === this.defaultDecimals + 1) {
            const integerPart = newDigits[0] || '0';
            const decimalPart = newDigits.slice(1);
            return integerPart + '.' + decimalPart;
          } else {
            // Se tem menos de 5 dígitos, tudo é decimal (preenche com zeros à esquerda)
            const decimalPart = newDigits.padStart(this.defaultDecimals, '0');
            return '0.' + decimalPart;
          }
        } else {
          // Se já tinha mais de 4 casas decimais, permite crescer
          // Calcula quantos dígitos decimais temos agora
          const currentDecimalDigits = Math.min(originalDecimalDigits + 1, this.decimals);
          
          if (newDigits.length <= currentDecimalDigits) {
            // Tudo é decimal
            return '0.' + newDigits;
          } else {
            // Separa inteiro e decimal
            const integerPart = newDigits.slice(0, -currentDecimalDigits) || '0';
            const decimalPart = newDigits.slice(-currentDecimalDigits);
            return integerPart + '.' + decimalPart;
          }
        }
      } else {
        // Se temos mais dígitos, separa inteiro e decimal
        // Mantém o número de casas decimais do original, mas permite crescer se necessário
        const currentDecimalDigits = originalDecimalDigits < this.defaultDecimals ? this.defaultDecimals : originalDecimalDigits;
        const integerPart = newDigits.slice(0, -currentDecimalDigits) || '0';
        const decimalPart = newDigits.slice(-currentDecimalDigits);
        return integerPart + '.' + decimalPart;
      }
    } else {
      // Se não tinha ponto, adiciona ponto após o primeiro dígito não-zero
      if (newDigits.length <= this.defaultDecimals + 1) {
        if (newDigits.length === this.defaultDecimals + 1) {
          const integerPart = newDigits[0] || '0';
          const decimalPart = newDigits.slice(1);
          return integerPart + '.' + decimalPart;
        } else {
          const decimalPart = newDigits.padStart(this.defaultDecimals, '0');
          return '0.' + decimalPart;
        }
      } else {
        const integerPart = newDigits.slice(0, -this.defaultDecimals) || '0';
        const decimalPart = newDigits.slice(-this.defaultDecimals);
        return integerPart + '.' + decimalPart;
      }
    }
  }

  @HostListener('blur', ['$event'])
  onBlur(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^\d.]/g, '');
    
    // Se o valor estiver vazio, inicializa com 0.0000
    if (value === '' || value === '0') {
      value = '0.0000';
    }
    
    const parts = value.split('.');
    let integerPart = parts[0] || '0';
    let decimalPart = parts[1] || '';
    
    // Se houver mais de um ponto, mantém apenas o primeiro
    if (parts.length > 2) {
      integerPart = parts[0] || '0';
      decimalPart = parts.slice(1).join('');
    }
    
    if (integerPart === '') {
      integerPart = '0';
    }
    
    // Limita ao máximo de casas decimais permitidas
    if (decimalPart.length > this.decimals) {
      decimalPart = decimalPart.substring(0, this.decimals);
    }
    
    // Se o usuário digitou mais de 4 casas decimais, mantém como está
    // Se digitou 4 ou menos, preenche até 4 casas decimais
    if (decimalPart.length <= this.defaultDecimals) {
      while (decimalPart.length < this.defaultDecimals) {
        decimalPart += '0';
      }
    }
    // Se tem mais de 4 casas, mantém como está (não preenche)
    
    let numericValue = integerPart + '.' + decimalPart;
    
    // Atualiza o valor do formulário
    if (this.control.control) {
      const numericValueForForm = parseFloat(numericValue);
      this.control.control.setValue(numericValueForForm, { emitEvent: false });
    }
    
    const formattedValue = integerPart + '.' + decimalPart;
    this.applyMask(formattedValue);
  }
  
  @HostListener('focus', ['$event'])
  onFocus(event: Event): void {
    const input = event.target as HTMLInputElement;
    // Quando o campo recebe foco, posiciona o cursor no final
    setTimeout(() => {
      input.setSelectionRange(input.value.length, input.value.length);
    }, 0);
  }

  private formatArea(value: string | number): string {
    // Se o valor for null, undefined ou vazio, retorna 0.0000
    if (value === null || value === undefined || value === '') {
      return '0.' + '0'.repeat(this.defaultDecimals);
    }
    
    // Converte para string se for número
    let valueStr = value.toString();
    
    // Remove vírgulas e garante que só há um ponto
    valueStr = valueStr.replace(/,/g, '.');
    
    const parts = valueStr.split('.');
    let integerPart = parts[0] || '0';
    let decimalPart = parts[1] || '';
    
    // Se houver mais de um ponto, mantém apenas o primeiro
    if (parts.length > 2) {
      integerPart = parts[0] || '0';
      decimalPart = parts.slice(1).join('');
    }
    
    // Se a parte inteira estiver vazia, define como 0
    if (integerPart === '') {
      integerPart = '0';
    }
    
    // Limita casas decimais ao máximo configurado
    if (decimalPart.length > this.decimals) {
      decimalPart = decimalPart.substring(0, this.decimals);
    }
    
    // Se não houver parte decimal e o valor for zero, mostra 0.0000
    if (decimalPart === '' && parseFloat(integerPart) === 0) {
      return '0.' + '0'.repeat(this.defaultDecimals);
    }
    
    // Se houver parte decimal
    if (decimalPart) {
      // Se o usuário digitou mais de 4 casas, mostra todas (até o máximo)
      // Se digitou 4 ou menos, preenche até 4 casas para exibição padrão
      if (decimalPart.length <= this.defaultDecimals) {
        decimalPart = decimalPart.padEnd(this.defaultDecimals, '0');
      }
      return integerPart + '.' + decimalPart;
    }
    
    // Se não houver parte decimal mas o valor não é zero, mostra com 4 casas decimais
    return integerPart + '.' + '0'.repeat(this.defaultDecimals);
  }

  private applyMask(value: string): void {
    this.el.nativeElement.value = value;
  }
}

