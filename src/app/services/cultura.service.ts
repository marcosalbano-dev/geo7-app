import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../environments/environment';

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

    constructor(private http: HttpClient) { }

    listarTodas(): Observable<Cultura[]> {
        if (!this.cache$) {
            this.cache$ = this.http.get<Cultura[]>(this.apiUrl).pipe(shareReplay(1));
        }
        return this.cache$;
    }

    buscarPorId(id: number): Observable<Cultura> {
        return this.http.get<Cultura>(`${this.apiUrl}/${id}`);
    }

    /** caso precise recarregar forçadamente */
    refresh(): void {
        this.cache$ = undefined;
    }
}
