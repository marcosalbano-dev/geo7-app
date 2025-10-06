import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Distrito } from '../models/distrito';
import { environment } from '../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class DistritoService {
  private apiUrl = `${environment.apiUrl}/distritos`;

  constructor(private http: HttpClient) { }

  private _todos$?: Observable<Distrito[]>;

  getDistritosByMunicipio(municipioId: number): Observable<Distrito[]> {
    return this.http.get<Distrito[]>(`${this.apiUrl}?municipioId=${municipioId}`);
  }

  listarTodos(): Observable<Distrito[]> {
      if (!this._todos$) {
        this._todos$ = this.http.get<Distrito[]>(this.apiUrl).pipe(shareReplay(1));
      }
      return this._todos$;
    }

}
