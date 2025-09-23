import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CategoriaAnimal {
    id: number;
    denominaoCategoriaAnimal: string;
    codigo?: number;
}

@Injectable({ providedIn: 'root' })
export class CategoriaAnimalService {
    private apiUrl = `${environment.apiUrl}/categorias-animal`;
    private cache$?: Observable<CategoriaAnimal[]>;

    constructor(private http: HttpClient) { }

    listarTodas(): Observable<CategoriaAnimal[]> {
        if (!this.cache$) {
            this.cache$ = this.http.get<CategoriaAnimal[]>(this.apiUrl).pipe(shareReplay(1));
        }
        return this.cache$;
    }

    buscarPorId(id: number): Observable<CategoriaAnimal> {
        return this.http.get<CategoriaAnimal>(`${this.apiUrl}/${id}`);
    }

    refresh(): void {
        this.cache$ = undefined;
    }
}
