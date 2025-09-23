import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AreaComOutroUso {
    id: number;
    denominacao: string;
    codigo?: number;
}

@Injectable({ providedIn: 'root' })
export class AreaComOutroUsoService {
    private apiUrl = `${environment.apiUrl}/areas-com-outro-uso`;
    private cache$?: Observable<AreaComOutroUso[]>;

    constructor(private http: HttpClient) { }

    listarTodas(): Observable<AreaComOutroUso[]> {
        if (!this.cache$) {
            this.cache$ = this.http.get<AreaComOutroUso[]>(this.apiUrl).pipe(shareReplay(1));
        }
        return this.cache$;
    }

    buscarPorId(id: number): Observable<AreaComOutroUso> {
        return this.http.get<AreaComOutroUso>(`${this.apiUrl}/${id}`);
    }

    refresh(): void {
        this.cache$ = undefined;
    }
}
