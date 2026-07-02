/**
 * Evalúa una decisión y actualiza el perfil cognitivo.
 * Función PURA: mismos inputs, mismo output.
 * @param {import('../types/index').CognitiveProfile} currentProfile
 * @param {import('../types/index').ScenarioContext} scenarioContext
 * @param {import('../types/index').ScenarioOption} chosenOption
 * @returns {import('../types/index').CognitiveProfile}
 */
function evaluateDecision(currentProfile, scenarioContext, chosenOption) {
  const { coherence, risk, consistency, totalDecisions } = currentProfile;
  const { coherenceImpact, riskImpact, consistencyImpact } = chosenOption.weights;

  // 1. Promedio móvil ponderado
  const newCoherence = (coherence * totalDecisions + coherenceImpact) / (totalDecisions + 1);
  const newRisk = (risk * totalDecisions + riskImpact) / (totalDecisions + 1);
  const newConsistency = (consistency * totalDecisions + consistencyImpact) / (totalDecisions + 1);

  // 2. Penalización contextual (si el escenario pedía precaución y el usuario fue riesgoso)
  const riskPenalty = Math.abs(scenarioContext.expectedRisk - riskImpact) * 0.1;
  const finalRisk = Math.max(0, Math.min(1, newRisk - riskPenalty));

  // 3. Clamping para mantener valores entre 0 y 1
  return {
    coherence: Math.max(0, Math.min(1, newCoherence)),
    risk: finalRisk,
    consistency: Math.max(0, Math.min(1, newConsistency)),
    totalDecisions: totalDecisions + 1,
  };
}

module.exports = { evaluateDecision };
