// src/app/services/municipio.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Municipio } from '../models/municipio';
import { Estrutura } from '../cadastro-estrutura/estrutura';

@Injectable({
  providedIn: 'root'
})
export class MunicipioService {
  private apiUrl = `${environment.apiUrl}/municipios`;

  constructor(private http: HttpClient) { }

  salvar(estrutura: Estrutura){
    
  }

  getMunicipiosCe(): Observable<Municipio[]> {
    return this.http.get<Municipio[]>(this.apiUrl).pipe(
      map(municipios => municipios.filter(m => m.uf === 'CE'))
    );
  }
}