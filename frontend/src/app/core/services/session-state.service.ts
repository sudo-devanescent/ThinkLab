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
  private readonly STORAGE_KEY = 'thinklab_session_state';

  private readState(): SessionState {
    try {
      const raw = sessionStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) : { sessionScenarioId: null, currentScenario: null };
    } catch {
      return { sessionScenarioId: null, currentScenario: null };
    }
  }

  private writeState(state: SessionState): void {
    sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
  }

  getState(): SessionState {
    return { ...this.readState() };
  }

  setState(newState: Partial<SessionState>) {
    const current = this.readState();
    this.writeState({ ...current, ...newState });
  }

  reset() {
    sessionStorage.removeItem(this.STORAGE_KEY);
  }
}
