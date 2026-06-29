export interface ScenarioOption {
  id: string;
  code: string;
  text: string;
  narrativeConsequence: string;
}

export interface Scenario {
  id: string;
  title: string;
  context: string;
  difficultyLevel: 'easy' | 'medium' | 'hard';
  options: ScenarioOption[];
}

export interface ScenarioResponse {
  scenario: Scenario;
  sessionScenarioId: string;
  sessionId: string;
  orderIndex: number;
}
