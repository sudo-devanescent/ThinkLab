import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

export interface RegisterPayload {
  email: string;
  password?: string;
  fullName: string;
  role: 'student' | 'teacher' | 'admin';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey = 'thinklab_token';
  public currentUser$ = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient) {
    this.restoreUserSession();
  }

  login(email: string, password?: string): Observable<{ access_token: string }> {
    return this.http.post<{ access_token: string; user: User }>(
      `${environment.apiUrl}/auth/login`,
      { email, password }
    ).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.access_token);
        this.currentUser$.next(response.user);
      }),
      catchError(this.handleError)
    );
  }

  register(data: RegisterPayload): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/auth/register`, data).pipe(
      catchError(this.handleError)
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUser$.next(null);
  }

  getDecodedToken(): { sub: string; role: string; email: string; fullName?: string } | null {
    const token = localStorage.getItem(this.tokenKey);
    if (!token) return null;
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const decodedPayload = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decodedPayload);
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    const decoded = this.getDecodedToken();
    return decoded !== null;
  }

  private restoreUserSession() {
    const decoded = this.getDecodedToken();
    if (decoded) {
      this.currentUser$.next({
        id: decoded.sub,
        email: decoded.email,
        fullName: decoded.fullName || 'Usuario',
        role: decoded.role as 'student' | 'teacher' | 'admin',
        isActive: true
      });
    }
  }

  private handleError(error: HttpErrorResponse) {
    let msg = 'Error de autenticación.';
    if (error.status === 401) msg = 'Credenciales inválidas.';
    else if (error.status === 409) msg = 'El email ya está registrado.';
    else if (error.status === 0) msg = 'No se puede conectar con el servidor.';
    return throwError(() => new Error(msg));
  }
}
