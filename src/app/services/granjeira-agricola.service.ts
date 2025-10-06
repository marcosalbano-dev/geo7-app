import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../environments/environment';

export interface GranjeiraAgricola {
  id: number;
  codigo?: string | number | null;
  descricao: string;
  denominacao: string;
}

@Injectable({ providedIn: 'root' })
export class GranjeiraAgricolaService {
  /** ajuste se o endpoint do backend for diferente */
  private apiUrl = `${environment.apiUrl}/granjeira-agricola`;

  // cache simples da listagem
  private _todas$?: Observable<GranjeiraAgricola[]>;

  constructor(private http: HttpClient) {}

  listarTodas(): Observable<GranjeiraAgricola[]> {
    if (!this._todas$) {
      this._todas$ = this.http.get<GranjeiraAgricola[]>(this.apiUrl).pipe(shareReplay(1));
    }
    return this._todas$;
  }

  buscarPorId(id: number): Observable<GranjeiraAgricola> {
    return this.http.get<GranjeiraAgricola>(`${this.apiUrl}/${id}`);
  }
}
