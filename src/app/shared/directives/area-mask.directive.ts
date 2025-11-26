import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appAreaMask]',
  standalone: true
})
export class AreaMaskDirective implements OnInit {
  @Input() decimals: number = 10; // Número máximo de casas decimais (permite mais de 4 como no Groovy)
  private defaultDecimals: number = 4; // Casas decimais padrão para exibição inicial
  private digitsValue: bigint = 0n;
  private readonly scaleFactor: bigint;
  private isFocused = false;

  constructor(
    private el: ElementRef<HTMLInputElement>,
    private control: NgControl
  ) {
    this.scaleFactor = this.computeScaleFactor(this.defaultDecimals);
  }

  ngOnInit(): void {
    // Aplica a máscara no valor inicial se existir
    if (this.control.control) {
      // Observa mudanças no valor do formulário para aplicar máscara
      this.control.control.valueChanges.subscribe((value) => {
        const currentDigits = this.digitsValue.toString();
        const incomingDigits = this.parseValueToDigits(
          value !== null && value !== undefined && value !== '' ? value : 0
        ).toString();
        
        if (currentDigits !== incomingDigits) {
          this.digitsValue = BigInt(incomingDigits);
          this.updateViewFromDigits(false);
        }
      });
      
      // Aplica máscara no valor inicial
      setTimeout(() => {
        const initialValue = this.control.control?.value;
        if (initialValue !== null && initialValue !== undefined && initialValue !== '') {
          this.digitsValue = this.parseValueToDigits(initialValue);
          this.updateViewFromDigits(false);
        } else {
          // Se não houver valor inicial, inicializa com 0.0000
          this.digitsValue = 0n;
          this.updateViewFromDigits(true);
        }
      }, 0);
    }
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }

    if (event.key >= '0' && event.key <= '9') {
      this.appendDigit(event.key);
      this.updateViewFromDigits();
      event.preventDefault();
      return;
    }

    if (event.key === 'Backspace') {
      this.removeDigits(1);
      this.updateViewFromDigits();
      event.preventDefault();
      return;
    }

    if (event.key === 'Delete') {
      this.removeDigits(1);
      this.updateViewFromDigits();
      event.preventDefault();
      return;
    }

    if (event.key === 'Escape') {
      this.digitsValue = 0n;
      this.updateViewFromDigits();
      event.preventDefault();
      return;
    }

    // Permite navegação com Tab e setas
    if (
      event.key === 'Tab' ||
      event.key === 'Enter' ||
      event.key.startsWith('Arrow') ||
      event.key === 'Home' ||
      event.key === 'End'
    ) {
      return;
    }

    event.preventDefault();
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pasted = event.clipboardData?.getData('text') || '';
    const digits = pasted.replace(/[^\d]/g, '');
    if (!digits) {
      return;
    }

    for (const digit of digits) {
      this.appendDigit(digit);
    }

    this.updateViewFromDigits();
  }
  
  private appendDigit(newDigit: string): string {
    const sanitizedDigit = newDigit.replace(/[^\d]/g, '');
    if (sanitizedDigit === '') {
      return this.getNumericStringFromDigits();
    }

    this.digitsValue = this.digitsValue * 10n + BigInt(sanitizedDigit);
    return this.getNumericStringFromDigits();
  }

  private removeDigits(count: number): string {
    const runs = Math.max(count, 1);
    for (let i = 0; i < runs; i++) {
      this.digitsValue = this.digitsValue / 10n;
    }
    return this.getNumericStringFromDigits();
  }

  private getNumericStringFromDigits(): string {
    return this.digitsToNumericString(this.digitsValue);
  }

  @HostListener('blur', ['$event'])
  onBlur(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.isFocused = false;
    this.setDigitsFromValue(input.value);
    this.updateViewFromDigits();
  }
  
  @HostListener('focus', ['$event'])
  onFocus(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.isFocused = true;
    this.updateViewFromDigits(false);
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

  private applyMask(value: string, trimTrailingZeros: boolean): string {
    const displayValue = this.formatDisplayValue(value, trimTrailingZeros);
    this.el.nativeElement.value = displayValue;
    return displayValue;
  }

  private formatDisplayValue(value: string, trimTrailingZeros: boolean): string {
    if (!value) {
      return '0,' + '0'.repeat(this.defaultDecimals);
    }

    const parts = value.split('.');
    let integerPart = parts[0] || '0';
    let decimalPart = parts[1] || '';

    if (integerPart === '') {
      integerPart = '0';
    }

    if (decimalPart.length > this.decimals) {
      decimalPart = decimalPart.substring(0, this.decimals);
    }

    // Normaliza a parte inteira (remove zeros à esquerda, mas mantém '0' se for zero)
    // IMPORTANTE: Se a parte inteira for "0", mantém "0" para valores como 0.1200
    const integerNormalized = integerPart === '0' ? '0' : (integerPart.replace(/^0+(?=\d)/, '') || '0');
    const integerWithSeparators = integerNormalized.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Garante que a parte decimal tenha sempre 4 casas
    if (decimalPart.length === 0) {
      decimalPart = '0'.repeat(this.defaultDecimals);
    } else if (decimalPart.length <= this.defaultDecimals) {
      decimalPart = decimalPart.padEnd(this.defaultDecimals, '0');
    }

    // Quando não está focado, remove apenas se TODA a parte decimal for zeros E a parte inteira não for zero
    // Isso preserva zeros significativos como em 0.1200 (que deve mostrar 0,1200)
    const isZeroDecimal = /^0+$/.test(decimalPart);
    if (trimTrailingZeros && isZeroDecimal && integerNormalized !== '0') {
      return integerWithSeparators;
    }

    // Sempre mostra a parte decimal quando está focado ou quando há zeros significativos
    // Para valores como 0.1200, sempre mostra 0,1200 (não remove zeros significativos)
    return integerWithSeparators + ',' + decimalPart;
  }

  private updateViewFromDigits(updateControl: boolean = true): void {
    const numericValue = this.getNumericStringFromDigits();
    if (updateControl && this.control.control) {
      const numericValueForForm = parseFloat(numericValue);
      this.control.control.setValue(numericValueForForm, { emitEvent: false });
    }

    const displayValue = this.applyMask(numericValue, !this.isFocused);
    this.el.nativeElement.setAttribute('data-previous-value', numericValue);

    setTimeout(() => {
      this.el.nativeElement.setSelectionRange(displayValue.length, displayValue.length);
    }, 0);
  }

  private digitsToNumericString(digits: bigint): string {
    const integerPart = digits / this.scaleFactor;
    const decimalPart = digits % this.scaleFactor;
    const decimalStr = decimalPart.toString().padStart(this.defaultDecimals, '0');
    return `${integerPart.toString()}.${decimalStr}`;
  }

  private computeScaleFactor(decimals: number): bigint {
    let factor = 1n;
    for (let i = 0; i < decimals; i++) {
      factor *= 10n;
    }
    return factor;
  }

  private parseValueToDigits(value: string | number): bigint {
    if (value === null || value === undefined) {
      return 0n;
    }

    // Se for número, usa toFixed para preservar casas decimais
    let raw: string;
    if (typeof value === 'number') {
      // Usa toFixed para garantir que valores como 0.12 sejam preservados como "0.1200"
      // e não sejam convertidos para notação científica ou percam precisão
      raw = value.toFixed(this.defaultDecimals);
    } else {
      raw = value.toString().trim();
    }

    if (raw === '') {
      return 0n;
    }

    // Remove espaços
    let sanitized = raw.replace(/\s+/g, '');
    
    // Identifica o separador decimal
    const hasComma = sanitized.includes(',');
    const hasDot = sanitized.includes('.');
    
    if (hasComma) {
      // Formato brasileiro: vírgula é decimal, pontos são milhar
      // Remove todos os pontos (milhar) e substitui vírgula por ponto
      sanitized = sanitized.replace(/\./g, '');
      sanitized = sanitized.replace(',', '.');
    } else if (hasDot) {
      // Formato internacional: precisa identificar se é separador decimal ou milhar
      const dotCount = (sanitized.match(/\./g) || []).length;
      if (dotCount > 1) {
        // Múltiplos pontos = separadores de milhar
        // Remove todos os pontos e trata como número inteiro
        sanitized = sanitized.replace(/\./g, '');
        // Adiciona .0000 para manter 4 casas decimais
        sanitized = sanitized + '.0000';
      }
      // Se tem apenas um ponto, mantém como separador decimal
    } else {
      // Não tem separador decimal, trata como inteiro e adiciona .0000
      sanitized = sanitized + '.0000';
    }

    const parts = sanitized.split('.');
    let integerPart = parts[0]?.replace(/[^\d]/g, '') || '0';
    let decimalPart = parts[1] ? parts[1].replace(/[^\d]/g, '') : '';

    if (parts.length > 2) {
      // Se ainda tem múltiplos pontos após processamento, junta tudo exceto o primeiro
      decimalPart = parts.slice(1).join('').replace(/[^\d]/g, '');
    }

    // IMPORTANTE: Mantém '0' se a parte inteira for zero (não remove zeros à esquerda quando é zero)
    if (integerPart === '' || integerPart === '0' || /^0+$/.test(integerPart)) {
      integerPart = '0';
    } else {
      integerPart = integerPart.replace(/^0+(?=\d)/, '') || '0';
    }

    if (decimalPart.length > this.decimals) {
      decimalPart = decimalPart.substring(0, this.decimals);
    }

    // Preenche com zeros à direita até ter 4 casas decimais
    decimalPart = decimalPart.padEnd(this.defaultDecimals, '0').substring(0, this.defaultDecimals);

    const digitsString = integerPart + decimalPart;
    if (digitsString === '' || digitsString === '0'.repeat(this.defaultDecimals + 1)) {
      return 0n;
    }

    return BigInt(digitsString);
  }

  private setDigitsFromValue(value: string | number): string {
    this.digitsValue = this.parseValueToDigits(value);
    return this.getNumericStringFromDigits();
  }

}
