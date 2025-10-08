import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface Cultura {
    id: number;
    nomeCultura: string;
    codigoCultura?: number;
    tipoCultura?: string;
}

@Injectable({ providedIn: 'root' })
export class CulturaService {
    private apiUrl = `${environment.apiUrl}/culturas`;
    private cache$?: Observable<Cultura[]>;

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

    listarTodas(): Observable<Cultura[]> {
        if (!this.cache$) {
            this.cache$ = this.http.get<Cultura[]>(this.apiUrl, {
                headers: this.getHeaders()
            }).pipe(shareReplay(1));
        }
        return this.cache$;
    }

    buscarPorId(id: number): Observable<Cultura> {
        return this.http.get<Cultura>(`${this.apiUrl}/${id}`, {
            headers: this.getHeaders()
        });
    }

    /** caso precise recarregar forçadamente */
    refresh(): void {
        this.cache$ = undefined;
    }
}
