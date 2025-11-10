import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface CategoriaAnimal {
    id: number;
    denominaoCategoriaAnimal: string;
    codigo?: number;
}

@Injectable({ providedIn: 'root' })
export class CategoriaAnimalService {
    private apiUrl = `${environment.apiUrl}/categorias-animal`;
    private cache$?: Observable<CategoriaAnimal[]>;

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

    listarTodas(): Observable<CategoriaAnimal[]> {
        if (!this.cache$) {
            this.cache$ = this.http.get<CategoriaAnimal[]>(this.apiUrl, {
                headers: this.getHeaders()
            }).pipe(shareReplay(1));
        }
        return this.cache$;
    }

    buscarPorId(id: number): Observable<CategoriaAnimal> {
        return this.http.get<CategoriaAnimal>(`${this.apiUrl}/${id}`, {
            headers: this.getHeaders()
        });
    }

    refresh(): void {
        this.cache$ = undefined;
    }
}
