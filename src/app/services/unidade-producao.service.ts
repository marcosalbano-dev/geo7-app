import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from '../../environments/environment';
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { AuthService } from "./auth.service";

export interface UnidadeProducao {
  id: number;
  codigoUnidade: string;
  unidade: string;
}

// Interface para resposta do backend (pode vir em snake_case ou camelCase)
interface UnidadeProducaoResponse {
  id: number;
  codigoUnidade?: string;
  codigo_unidade?: string;
  unidade: string;
}

@Injectable({ providedIn: 'root' }) 
export class UnidadeProducaoService {

    private apiUrl = `${environment.apiUrl}/unidades-producao`;

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

    listarTodas(): Observable<UnidadeProducao[]> {
      return this.http.get<UnidadeProducaoResponse[]>(this.apiUrl, {
        headers: this.getHeaders()
      }).pipe(
        map((response) => {
          console.log('Resposta do backend (unidades-producao):', response);
          // Normaliza os dados para garantir formato consistente
          return response.map((item) => ({
            id: item.id,
            codigoUnidade: item.codigoUnidade ?? item.codigo_unidade ?? '',
            unidade: item.unidade ?? '',
          })).filter((item) => item.id && item.codigoUnidade && item.unidade);
        })
      );
  }
}