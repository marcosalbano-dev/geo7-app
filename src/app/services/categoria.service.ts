import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Categoria {
    id: number;
    nomeCategoria: string;
}

@Injectable({ providedIn: 'root' })
export class CategoriaService {
    private apiUrl = `${environment.apiUrl}/categorias`;
    private cache$?: Observable<Categoria[]>;

    constructor(private http: HttpClient) { }

    listarTodas(): Observable<Categoria[]> {
        if (!this.cache$) {
            this.cache$ = this.http.get<Categoria[]>(this.apiUrl).pipe(shareReplay(1));
        }
        return this.cache$;
    }

    buscarPorId(id: number): Observable<Categoria> {
        return this.http.get<Categoria>(`${this.apiUrl}/${id}`);
    }

    /** caso precise recarregar forçadamente */
    refresh(): void {
        this.cache$ = undefined;
    }
}
