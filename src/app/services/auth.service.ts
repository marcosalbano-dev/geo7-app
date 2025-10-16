import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = environment.auth.tokenKey;
  private readonly USER_KEY = environment.auth.userKey;
  
  // Configuração para usar mock temporariamente
  private readonly USE_MOCK_AUTH = false; // Mude para false quando o backend estiver rodando
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const user = localStorage.getItem(this.USER_KEY);
    
    if (token && user) {
      try {
        const userObj = JSON.parse(user);
        this.currentUserSubject.next(userObj);
      } catch (error) {
        this.logout();
      }
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    if (this.USE_MOCK_AUTH) {
      return this.mockLogin(credentials);
    }
    
    // Usar backend real
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem(this.TOKEN_KEY, response.token);
          localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        })
      );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    if (this.USE_MOCK_AUTH) {
      return this.mockRegister(userData);
    }
    
    // Usar backend real
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, userData)
      .pipe(
        tap(response => {
          localStorage.setItem(this.TOKEN_KEY, response.token);
          localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/landingpage']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getCurrentUser();
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'ADMIN';
  }

  getAuthHeaders(): { [key: string]: string } {
    const token = this.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  refreshUser(): Observable<{ user: User }> {
    if (this.USE_MOCK_AUTH) {
      return this.mockRefreshUser();
    }
    
    // Usar backend real
    return this.http.get<{ user: User }>(`${this.API_URL}/me`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(response => {
        localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
      })
    );
  }

  // Métodos mock para desenvolvimento
  private mockLogin(credentials: LoginRequest): Observable<AuthResponse> {
    // Simular delay de rede
    return new Observable(observer => {
      setTimeout(() => {
        // Credenciais válidas para teste
        if (credentials.email === 'admin@geo7.com' && credentials.password === 'admin123') {
          const mockUser: User = {
            id: '1',
            name: 'Administrador do Sistema',
            email: 'admin@geo7.com',
            role: 'ADMIN'
          };
          
          const mockResponse: AuthResponse = {
            message: 'Login realizado com sucesso',
            user: mockUser,
            token: 'mock-jwt-token-' + Date.now()
          };
          
          localStorage.setItem(this.TOKEN_KEY, mockResponse.token);
          localStorage.setItem(this.USER_KEY, JSON.stringify(mockResponse.user));
          this.currentUserSubject.next(mockResponse.user);
          
          observer.next(mockResponse);
          observer.complete();
        } else if (credentials.email === 'user@geo7.com' && credentials.password === 'user123') {
          const mockUser: User = {
            id: '2',
            name: 'Usuário Teste',
            email: 'user@geo7.com',
            role: 'USER'
          };
          
          const mockResponse: AuthResponse = {
            message: 'Login realizado com sucesso',
            user: mockUser,
            token: 'mock-jwt-token-' + Date.now()
          };
          
          localStorage.setItem(this.TOKEN_KEY, mockResponse.token);
          localStorage.setItem(this.USER_KEY, JSON.stringify(mockResponse.user));
          this.currentUserSubject.next(mockResponse.user);
          
          observer.next(mockResponse);
          observer.complete();
        } else {
          observer.error({
            error: { error: 'Credenciais inválidas' },
            status: 401
          });
        }
      }, 1000); // Simular delay de 1 segundo
    });
  }

  private mockRegister(userData: RegisterRequest): Observable<AuthResponse> {
    return new Observable(observer => {
      setTimeout(() => {
        const mockUser: User = {
          id: Date.now().toString(),
          name: userData.name,
          email: userData.email,
          role: userData.role || 'USER'
        };
        
        const mockResponse: AuthResponse = {
          message: 'Usuário registrado com sucesso',
          user: mockUser,
          token: 'mock-jwt-token-' + Date.now()
        };
        
        localStorage.setItem(this.TOKEN_KEY, mockResponse.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(mockResponse.user));
        this.currentUserSubject.next(mockResponse.user);
        
        observer.next(mockResponse);
        observer.complete();
      }, 1000);
    });
  }

  private mockRefreshUser(): Observable<{ user: User }> {
    return new Observable(observer => {
      setTimeout(() => {
        const user = this.getCurrentUser();
        if (user) {
          observer.next({ user });
          observer.complete();
        } else {
          observer.error({ error: 'Usuário não encontrado' });
        }
      }, 500);
    });
  }
}
