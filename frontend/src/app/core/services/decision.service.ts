import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DecisionRequest, DecisionResponse } from '../models/decision.model';

@Injectable({
  providedIn: 'root'
})
export class DecisionService {

  constructor(private http: HttpClient) {}

  submitDecision(payload: DecisionRequest): Observable<DecisionResponse> {
    return this.http.post<{
      updatedProfile: { coherence: number; risk: number; consistency: number; totalDecisions: number };
      currentScenarioId: string;
    }>(`${environment.apiUrl}/decisions`, payload).pipe(
      map(response => {
        const avgScore = (
          response.updatedProfile.coherence +
          response.updatedProfile.consistency +
          (1 - response.updatedProfile.risk)
        ) / 3;

        let level: 'positive' | 'neutral' | 'warning' = 'neutral';
        let message = 'Has tomado una decisión razonable. Evaluaste las opciones de manera equilibrada, aunque existen oportunidades para afinar tu análisis crítico.';

        if (avgScore > 0.7) {
          level = 'positive';
          message = 'Excelente análisis. Tu elección demuestra una gran coherencia ética y una sólida consistencia en la evaluación del riesgo.';
        } else if (avgScore < 0.4) {
          level = 'warning';
          message = 'Atención. La decisión tomada refleja un riesgo desproporcionado o una falta de coherencia con los principios fundamentales del escenario.';
        }

        return {
          updatedProfile: response.updatedProfile,
          feedback: { message, level },
          currentScenarioId: response.currentScenarioId,
        };
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let msg = 'Error al enviar la decisión.';
    if (error.status === 400) msg = 'La opción seleccionada no es válida para este escenario.';
    else if (error.status === 401) msg = 'Sesión expirada. Inicia sesión nuevamente.';
    else if (error.status === 0) msg = 'No se puede conectar con el servidor.';
    return throwError(() => new Error(msg));
  }
}
