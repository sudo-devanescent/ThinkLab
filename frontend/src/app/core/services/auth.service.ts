import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
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
    // Check credentials and return mock JWT. In production, this would be an http.post.
    let token = '';
    let user: User | null = null;

    if (email === 'j.vidaurre@thinklab.edu.pe') {
      token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdHVkZW50XzEyMyIsInJvbGUiOiJzdHVkZW50IiwiZW1haWwiOiJqLnZpZGF1cnJlQHRoaW5rbGFiLmVkdS5wZSIsImZ1bGxOYW1lIjoiSmF2aWVyIFZpZGF1cnJlIn0=.signature';
      user = { id: 'student_123', email: 'j.vidaurre@thinklab.edu.pe', fullName: 'Javier Vidaurre', role: 'student', isActive: true };
    } else if (email === 'j.pacheco@thinklab.edu.pe') {
      token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZWFjaGVyXzEyMyIsInJvbGUiOiJ0ZWFjaGVyIiwiZW1haWwiOiJqLnBhY2hlY29AdGhpbmtsYWIuZWR1LnBlIiwiZnVsbE5hbWUiOiJKb3PDqSBQYWNoZWNvIn0=.signature';
      user = { id: 'teacher_123', email: 'j.pacheco@thinklab.edu.pe', fullName: 'José Pacheco', role: 'teacher', isActive: true };
    } else if (email === 'admin@thinklab.edu.pe') {
      token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbl8xMjMiLCJyb2xlIjoiYWRtaW4iLCJlbWFpbCI6ImFkbWluQHRoaW5rbGFiLmVkdS5wZSIsImZ1bGxOYW1lIjoiQWRtaW5pc3RyYWRvciBHZW5lcmFsIn0=.signature';
      user = { id: 'admin_123', email: 'admin@thinklab.edu.pe', fullName: 'Administrador General', role: 'admin', isActive: true };
    } else {
      return throwError(() => new Error('Credenciales inválidas'));
    }

    localStorage.setItem(this.tokenKey, token);
    this.currentUser$.next(user);

    return of({ access_token: token });
  }

  register(data: RegisterPayload): Observable<User> {
    const newUser: User = {
      id: Math.random().toString(36).substring(2),
      email: data.email,
      fullName: data.fullName,
      role: data.role,
      isActive: true
    };
    // Mock register success.
    return of(newUser);
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
}
