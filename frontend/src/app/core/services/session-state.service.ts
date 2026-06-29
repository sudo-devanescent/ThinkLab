import { Injectable } from '@angular/core';
import { Scenario } from '../models/scenario.model';

export interface SessionState {
  sessionScenarioId: string | null;
  currentScenario: Scenario | null;
}

@Injectable({
  providedIn: 'root'
})
export class SessionStateService {
  private state: SessionState = {
    sessionScenarioId: null,
    currentScenario: null,
  };

  getState(): SessionState {
    return { ...this.state };
  }

  setState(newState: Partial<SessionState>) {
    this.state = { ...this.state, ...newState };
  }

  reset() {
    this.state = {
      sessionScenarioId: null,
      currentScenario: null,
    };
  }
}
