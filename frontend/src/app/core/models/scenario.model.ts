export interface ScenarioOption {
  id: string;             // UUID de scenario_options
  code: string;           // 'A', 'B', 'C'
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
  sessionMeta: {
    current: number;
    totalRecommended: number;
  };
}
