import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface Categoria {
    id: number;
    nomeCategoria: string;
}

@Injectable({ providedIn: 'root' })
export class CategoriaService {
    private apiUrl = `${environment.apiUrl}/categorias`;
    private cache$?: Observable<Categoria[]>;

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

    listarTodas(): Observable<Categoria[]> {
        if (!this.cache$) {
            this.cache$ = this.http.get<Categoria[]>(this.apiUrl, {
                headers: this.getHeaders()
            }).pipe(shareReplay(1));
        }
        return this.cache$;
    }

    buscarPorId(id: number): Observable<Categoria> {
        return this.http.get<Categoria>(`${this.apiUrl}/${id}`, {
            headers: this.getHeaders()
        });
    }

    /** caso precise recarregar forçadamente */
    refresh(): void {
        this.cache$ = undefined;
    }
}
