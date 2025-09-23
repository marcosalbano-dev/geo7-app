import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AreasRestricoes {
    id: number;
    tipoAreaRestricao: string;
    codigo?: number;
}

@Injectable({ providedIn: 'root' })
export class AreasRestricoesService {
    private apiUrl = `${environment.apiUrl}/areas-restricoes`;
    private cache$?: Observable<AreasRestricoes[]>;

    constructor(private http: HttpClient) { }

    listarTodas(): Observable<AreasRestricoes[]> {
        if (!this.cache$) {
            this.cache$ = this.http.get<AreasRestricoes[]>(this.apiUrl).pipe(shareReplay(1));
        }
        return this.cache$;
    }

    buscarPorId(id: number): Observable<AreasRestricoes> {
        return this.http.get<AreasRestricoes>(`${this.apiUrl}/${id}`);
    }

    refresh(): void {
        this.cache$ = undefined;
    }
}
