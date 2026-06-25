import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DecisionRequest, DecisionResponse } from '../models/decision.model';
import { ProfileService } from './profile.service';
import { SessionStateService } from './session-state.service';

@Injectable({
  providedIn: 'root'
})
export class DecisionService {
  constructor(
    private profileService: ProfileService,
    private sessionState: SessionStateService
  ) {}

  submitDecision(payload: DecisionRequest): Observable<DecisionResponse> {
    const currentState = this.sessionState.getState();
    const currentProfile = this.profileService.getCachedProfile();

    // 1. Calculate next profile with random variations (-0.08 to +0.08)
    const randomShift = () => (Math.random() * 0.16) - 0.08;
    const clamp = (val: number) => Math.min(Math.max(val, 0), 1);

    const updatedProfile = {
      coherence: clamp(currentProfile.coherence + randomShift()),
      risk: clamp(currentProfile.risk + randomShift()),
      consistency: clamp(currentProfile.consistency + randomShift()),
      totalDecisions: currentProfile.totalDecisions + 1
    };

    // 2. Save updated profile
    this.profileService.updateProfile(updatedProfile);
    this.sessionState.setState({ lastProfile: updatedProfile });

    // 3. Determine feedback level based on average score
    const avgScore = (updatedProfile.coherence + updatedProfile.consistency + (1 - updatedProfile.risk)) / 3;
    let level: 'positive' | 'neutral' | 'warning' = 'neutral';
    let message = 'Has tomado una decisión razonable. Evaluaste las opciones de manera equilibrada, aunque existen oportunidades para afinar tu análisis crítico.';

    if (avgScore > 0.7) {
      level = 'positive';
      message = 'Excelente análisis. Tu elección demuestra una gran coherencia ética y una sólida consistencia en la evaluación del riesgo.';
    } else if (avgScore < 0.4) {
      level = 'warning';
      message = 'Atención. La decisión tomada refleja un riesgo desproporcionado o una falta de coherencia con los principios fundamentales del escenario.';
    }

    // 4. Determine nextScenarioId (if index is 5, session ends, so return null)
    let nextScenarioId: string | null = null;
    if (currentState.currentIndex < currentState.totalRecommended) {
      // Return a rotating mock ID
      const nextIndex = (currentState.currentIndex + 1);
      nextScenarioId = `scen-00${nextIndex}`;
    }

    return of({
      updatedProfile,
      feedback: {
        message,
        level
      },
      nextScenarioId
    });
  }
}
