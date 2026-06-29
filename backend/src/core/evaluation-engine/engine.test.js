const { evaluateDecision } = require('./engine.js');

describe('Motor de Evaluación - evaluateDecision', () => {
  test('Caso 1: Debe actualizar el perfil correctamente con una decisión positiva', () => {
    const currentProfile = { coherence: 0.5, risk: 0.5, consistency: 0.5, totalDecisions: 2 };
    const scenarioContext = { expectedRisk: 0.6 };
    const chosenOption = {
      weights: { coherenceImpact: 0.8, riskImpact: 0.2, consistencyImpact: 0.7 }
    };

    const result = evaluateDecision(currentProfile, scenarioContext, chosenOption);

    // Promedio: (0.5*2 + 0.8)/3 = 0.6
    expect(result.coherence).toBeCloseTo(0.6);
    expect(result.totalDecisions).toBe(3);
    // Verificar que no se pasó de 1
    expect(result.risk).toBeLessThanOrEqual(1);
  });

  test('Caso 2: Debe aplicar penalización por riesgo contextual', () => {
    const currentProfile = { coherence: 0.5, risk: 0.5, consistency: 0.5, totalDecisions: 0 };
    const scenarioContext = { expectedRisk: 0.2 }; // Escenario pide precaución
    const chosenOption = {
      weights: { coherenceImpact: 0.5, riskImpact: 0.9, consistencyImpact: 0.5 } // Usuario fue muy arriesgado
    };

    const result = evaluateDecision(currentProfile, scenarioContext, chosenOption);
    
    // Riesgo esperado: 0.9 - (|0.2-0.9| * 0.1) = 0.9 - 0.07 = 0.83
    expect(result.risk).toBeCloseTo(0.83);
  });

  test('Caso 3: Clamping - No debe superar 1 ni bajar de 0', () => {
    const currentProfile = { coherence: 0.5, risk: 0.5, consistency: 0.5, totalDecisions: 1 };
    const scenarioContext = { expectedRisk: 0.5 };
    const chosenOption = {
      weights: { coherenceImpact: 2.0, riskImpact: -2.0, consistencyImpact: 0.5 } // Fuera de rango
    };

    const result = evaluateDecision(currentProfile, scenarioContext, chosenOption);
    expect(result.coherence).toBe(1);
    expect(result.risk).toBe(0);
  });
});
