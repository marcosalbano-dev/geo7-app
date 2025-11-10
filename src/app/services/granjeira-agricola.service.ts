import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

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

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const authHeaders = this.authService.getAuthHeaders();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...authHeaders
    });
  }

  listarTodas(): Observable<GranjeiraAgricola[]> {
    if (!this._todas$) {
      this._todas$ = this.http.get<GranjeiraAgricola[]>(this.apiUrl, {
        headers: this.getHeaders()
      }).pipe(shareReplay(1));
    }
    return this._todas$;
  }

  buscarPorId(id: number): Observable<GranjeiraAgricola> {
    return this.http.get<GranjeiraAgricola>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }
}
