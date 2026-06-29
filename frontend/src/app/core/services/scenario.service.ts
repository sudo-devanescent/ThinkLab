import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ScenarioResponse } from '../models/scenario.model';
import { SessionStateService } from './session-state.service';

@Injectable({
  providedIn: 'root'
})
export class ScenarioService {

  constructor(
    private http: HttpClient,
    private sessionState: SessionStateService
  ) {}

  getNextScenario(): Observable<ScenarioResponse> {
    return this.http.get<ScenarioResponse>(`${environment.apiUrl}/scenarios/next`).pipe(
      tap(response => {
        this.sessionState.setState({
          sessionScenarioId: response.sessionScenarioId,
          currentScenario: response.scenario,
        });
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let msg = 'Error al obtener el escenario.';
    if (error.status === 401) msg = 'Sesión expirada. Inicia sesión nuevamente.';
    else if (error.status === 404) msg = 'No hay escenarios disponibles.';
    else if (error.status === 0) msg = 'No se puede conectar con el servidor.';
    return throwError(() => new Error(msg));
  }
}
