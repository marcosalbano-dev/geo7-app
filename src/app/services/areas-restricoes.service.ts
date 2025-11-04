import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface AreasRestricoes {
    id: number;
    tipoAreaRestricao: string;
    codigo?: number;
}

@Injectable({ providedIn: 'root' })
export class AreasRestricoesService {
    private apiUrl = `${environment.apiUrl}/areas-restricoes`;
    private cache$?: Observable<AreasRestricoes[]>;

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

    listarTodas(): Observable<AreasRestricoes[]> {
        if (!this.cache$) {
            this.cache$ = this.http.get<AreasRestricoes[]>(this.apiUrl, {
                headers: this.getHeaders()
            }).pipe(shareReplay(1));
        }
        return this.cache$;
    }

    buscarPorId(id: number): Observable<AreasRestricoes> {
        return this.http.get<AreasRestricoes>(`${this.apiUrl}/${id}`, {
            headers: this.getHeaders()
        });
    }

    refresh(): void {
        this.cache$ = undefined;
    }
}
