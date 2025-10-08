import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Distrito } from '../models/distrito';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';



@Injectable({
  providedIn: 'root'
})
export class DistritoService {
  private apiUrl = `${environment.apiUrl}/distritos`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getHeaders(): HttpHeaders {
    const authHeaders = this.authService.getAuthHeaders();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...authHeaders
    });
  }

  private _todos$?: Observable<Distrito[]>;

  getDistritosByMunicipio(municipioId: number): Observable<Distrito[]> {
    return this.http.get<Distrito[]>(`${this.apiUrl}?municipioId=${municipioId}`, {
      headers: this.getHeaders()
    });
  }

  listarTodos(): Observable<Distrito[]> {
      if (!this._todos$) {
        this._todos$ = this.http.get<Distrito[]>(this.apiUrl, {
          headers: this.getHeaders()
        }).pipe(shareReplay(1));
      }
      return this._todos$;
    }

}
