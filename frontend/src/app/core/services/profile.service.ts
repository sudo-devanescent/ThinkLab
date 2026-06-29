import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, map, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CognitiveProfile } from '../models/cognitive-profile.model';
import { StudentSummary } from '../models/user.model';

interface BackendProfileResponse {
  coherence: number;
  risk: number;
  consistency: number;
  totalDecisions: number;
  updatedAt: string | null;
  qualitative: {
    coherenceLabel: string;
    riskLabel: string;
    consistencyLabel: string;
    experience: string;
  };
}

interface BackendStudentResponse {
  userId: string;
  fullName: string;
  email: string;
  coherence: number;
  risk: number;
  consistency: number;
  totalDecisions: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private currentProfile$ = new BehaviorSubject<CognitiveProfile>({
    coherence: 0.5,
    risk: 0.5,
    consistency: 0.5,
    totalDecisions: 0
  });

  constructor(private http: HttpClient) {}

  getMyProfile(): Observable<CognitiveProfile> {
    return this.http.get<BackendProfileResponse>(`${environment.apiUrl}/profile/me`).pipe(
      tap(profile => {
        this.currentProfile$.next({
          coherence: profile.coherence,
          risk: profile.risk,
          consistency: profile.consistency,
          totalDecisions: profile.totalDecisions,
        });
      }),
      map(profile => ({
        coherence: profile.coherence,
        risk: profile.risk,
        consistency: profile.consistency,
        totalDecisions: profile.totalDecisions,
      })),
      catchError(this.handleError)
    );
  }

  getCachedProfile(): CognitiveProfile {
    return this.currentProfile$.getValue();
  }

  updateProfile(profile: CognitiveProfile) {
    this.currentProfile$.next(profile);
  }

  getStudents(): Observable<StudentSummary[]> {
    return this.http.get<BackendStudentResponse[]>(`${environment.apiUrl}/teacher/students`).pipe(
      map(students => students.map(s => ({
        studentId: s.userId,
        name: s.fullName,
        coherence: s.coherence,
        risk: s.risk,
        consistency: s.consistency,
        totalDecisions: s.totalDecisions,
      }))),
      catchError(this.handleError)
    );
  }

  getStudentDetail(id: string): Observable<StudentSummary & { email: string; recentDecisions: number; isActive: boolean }> {
    return this.http.get<BackendStudentResponse>(`${environment.apiUrl}/teacher/students/${id}`).pipe(
      map(student => ({
        studentId: student.userId,
        name: student.fullName,
        email: student.email,
        coherence: student.coherence,
        risk: student.risk,
        consistency: student.consistency,
        totalDecisions: student.totalDecisions,
        recentDecisions: student.totalDecisions > 5 ? 5 : student.totalDecisions,
        isActive: true,
      })),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let msg = 'Error al obtener los datos del perfil.';
    if (error.status === 401) msg = 'Sesión expirada. Inicia sesión nuevamente.';
    else if (error.status === 0) msg = 'No se puede conectar con el servidor.';
    return throwError(() => new Error(msg));
  }
}
