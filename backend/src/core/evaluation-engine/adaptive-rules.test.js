import { selectNextScenario } from './adaptive-rules.js';

describe('Sistema Adaptativo - selectNextScenario', () => {
  test('Debe seleccionar la regla de mayor prioridad que cumpla la condición', () => {
    const profile = { coherence: 0.3, risk: 0.8, totalDecisions: 5 };
    const rules = [
      { id: 1, condition: { 'profile.coherence': { '<': 0.4 } }, nextScenarioTag: 'facil_1', priority: 1 },
      { id: 2, condition: { 'profile.risk': { '>': 0.7 } }, nextScenarioTag: 'riesgo_1', priority: 2 },
      { id: 3, condition: { 'profile.totalDecisions': { '>': 3 } }, nextScenarioTag: 'avanzado_1', priority: 3 },
    ];

    const result = selectNextScenario(profile, rules);
    // La prioridad más alta que cumple es la #3 (priority 3), aunque la #1 y #2 también cumplen.
    expect(result).toBe('avanzado_1');
  });

  test('Debe retornar null si ninguna regla aplica', () => {
    const profile = { coherence: 0.9, risk: 0.2, totalDecisions: 1 };
    const rules = [
      { id: 1, condition: { 'profile.coherence': { '<': 0.4 } }, nextScenarioTag: 'facil', priority: 1 },
    ];
    const result = selectNextScenario(profile, rules);
    expect(result).toBeNull();
  });
});
