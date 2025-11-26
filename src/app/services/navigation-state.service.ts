import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationStateService {
  // Estado do município selecionado
  private municipioIdSelecionado$ = new BehaviorSubject<number | null>(null);
  
  // Estado do loteId selecionado
  private loteIdSelecionado$ = new BehaviorSubject<number | null>(null);

  constructor() { }

  // Métodos para município
  setMunicipioId(municipioId: number | null): void {
    this.municipioIdSelecionado$.next(municipioId);
  }

  getMunicipioId(): Observable<number | null> {
    return this.municipioIdSelecionado$.asObservable();
  }

  getMunicipioIdValue(): number | null {
    return this.municipioIdSelecionado$.value;
  }

  // Métodos para loteId
  setLoteId(loteId: number | null): void {
    this.loteIdSelecionado$.next(loteId);
  }

  getLoteId(): Observable<number | null> {
    return this.loteIdSelecionado$.asObservable();
  }

  getLoteIdValue(): number | null {
    return this.loteIdSelecionado$.value;
  }

  // Limpar estado
  clearState(): void {
    this.municipioIdSelecionado$.next(null);
    this.loteIdSelecionado$.next(null);
  }
}

