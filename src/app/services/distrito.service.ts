import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Distrito } from '../models/distrito';

@Injectable({
  providedIn: 'root'
})
export class DistritoService {
  private apiUrl = 'http://localhost:8080/api/distritos';

  constructor(private http: HttpClient) { }

  getDistritosByMunicipio(municipioId: number): Observable<Distrito[]> {
    return this.http.get<Distrito[]>(`${this.apiUrl}?municipioId=${municipioId}`);
  }

}
