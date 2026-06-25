import { CognitiveProfile } from './cognitive-profile.model';

export interface DecisionRequest {
  sessionScenarioId: string;
  optionId: string;
  responseTimeMs: number;
}

export interface DecisionResponse {
  updatedProfile: CognitiveProfile;
  feedback: {
    message: string;
    level: 'positive' | 'neutral' | 'warning';
  };
  nextScenarioId: string | null;
}
