import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Municipio } from '../models/municipio';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {

    private apiUrl = `${environment.apiUrl}/estados`;

    constructor(private http: HttpClient) {}

    getMunicipiosByEstado(uf: string): Observable<Municipio[]> {
      return this.http.get<Municipio[]>(`${this.apiUrl}/estado/${uf}`);
    }

    // Todos os estados
  // getEstados(): Observable<String[]> {
  //   return this.http.get<String[]>(this.apiUrl);
  // }
    


}