import { Injectable } from '@angular/core';
import { Scenario } from '../models/scenario.model';
import { CognitiveProfile } from '../models/cognitive-profile.model';

export interface SessionState {
  sessionScenarioId: string | null;  // Current session_scenario UUID
  currentScenario: Scenario | null;
  currentIndex: number;              // Position in the 5-scenario session
  totalRecommended: number;
  lastProfile: CognitiveProfile | null;
}

@Injectable({
  providedIn: 'root'
})
export class SessionStateService {
  private state: SessionState = {
    sessionScenarioId: null,
    currentScenario: null,
    currentIndex: 0,
    totalRecommended: 5,
    lastProfile: null
  };

  getState(): SessionState {
    return { ...this.state };
  }

  setState(newState: Partial<SessionState>) {
    this.state = {
      ...this.state,
      ...newState
    };
  }

  reset() {
    this.state = {
      sessionScenarioId: null,
      currentScenario: null,
      currentIndex: 0,
      totalRecommended: 5,
      lastProfile: null
    };
  }
}
