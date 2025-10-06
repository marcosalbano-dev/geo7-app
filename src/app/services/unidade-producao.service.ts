import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from '../../environments/environment';
import { Injectable } from "@angular/core";

export interface UnidadeProducao {
  id: number;
  codigoUnidade: string;
  unidade: string;
}
@Injectable({ providedIn: 'root' }) 
export class UnidadeProducaoService {

    private apiUrl = `${environment.apiUrl}/unidades-producao`;

    constructor(private http: HttpClient) { }

    listarTodas(): Observable<UnidadeProducao[]> {
    return this.http.get<UnidadeProducao[]>(this.apiUrl);
  }
}