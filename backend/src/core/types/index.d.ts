// Contracto entre el motor JS puro y el backend NestJS
export interface CognitiveProfile {
  coherence: number;      // 0 - 1
  risk: number;           // 0 - 1
  consistency: number;    // 0 - 1
  totalDecisions: number;
}

export interface ScenarioOption {
  id: string;
  text: string;
  narrativeConsequence: string;
  weights: {
    coherenceImpact: number;   // -1 a 1
    riskImpact: number;        // -1 a 1
    consistencyImpact: number; // -1 a 1
  };
}

export interface ScenarioContext {
  id: string;
  expectedRisk: number; // Nivel de riesgo esperado para este escenario (0-1)
}

export interface AdaptationRule {
  id: number;
  condition: Record<string, any>; // ej. { "profile.coherence": { "<": 0.4 } }
  nextScenarioTag: string;
  priority: number;
}

// Para que TypeScript trate esto como un módulo
export {};
