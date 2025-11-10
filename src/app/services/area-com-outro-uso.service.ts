import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface AreaComOutroUso {
    id: number;
    denominacao: string;
    codigo?: number;
}

@Injectable({ providedIn: 'root' })
export class AreaComOutroUsoService {
    private apiUrl = `${environment.apiUrl}/areas-com-outro-uso`;
    private cache$?: Observable<AreaComOutroUso[]>;

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

    listarTodas(): Observable<AreaComOutroUso[]> {
        if (!this.cache$) {
            this.cache$ = this.http.get<AreaComOutroUso[]>(this.apiUrl, {
                headers: this.getHeaders()
            }).pipe(shareReplay(1));
        }
        return this.cache$;
    }

    buscarPorId(id: number): Observable<AreaComOutroUso> {
        return this.http.get<AreaComOutroUso>(`${this.apiUrl}/${id}`, {
            headers: this.getHeaders()
        });
    }

    refresh(): void {
        this.cache$ = undefined;
    }
}
