// src/app/services/municipio.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Municipio } from '../models/municipio';
import { Estrutura } from '../models/estrutura';

@Injectable({
  providedIn: 'root'
})
export class MunicipioService {

  constructor(private apiService: ApiService) { }

  getMunicipiosCe(): Observable<Municipio[]> {
    return this.apiService.get<Municipio[]>('/municipios').pipe(
      map(municipios => municipios
        .filter(m => m.uf === 'CE')
        .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')))
    );
  }

  getUfs(): Observable<string[]> {
    return this.apiService.get<Municipio[]>('/municipios').pipe(
      map(municipios => [...new Set(municipios.map(m => m.uf))].sort())
    );
  }

  getMunicipiosPorUf(uf: string): Observable<Municipio[]> {
    return this.apiService.get<Municipio[]>('/municipios').pipe(
      map(municipios =>
        municipios
          .filter(m => m.uf === uf)
          .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
      )
    );
  }
}