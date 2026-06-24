/**
 * Selecciona la siguiente regla según el perfil y las reglas disponibles.
 * @param {import('../types/index').CognitiveProfile} profile
 * @param {import('../types/index').AdaptationRule[]} rules
 * @returns {string|null} El tag del siguiente escenario o null.
 */
export function selectNextScenario(profile, rules) {
  // Ordenar por prioridad descendente
  const sorted = [...rules].sort((a, b) => b.priority - a.priority);

  for (const rule of sorted) {
    const condition = rule.condition;
    let meetsCondition = true;

    for (const [key, operatorObj] of Object.entries(condition)) {
      // Ejemplo: key = "profile.coherence", operatorObj = { "<": 0.4 }
      const path = key.split('.');
      // Si la ruta empieza con 'profile', la raíz ya es el objeto profile
      if (path[0] === 'profile') path.shift();
      let value = profile;
      for (const segment of path) {
        value = value?.[segment];
      }

      if (value === undefined) {
        meetsCondition = false;
        break;
      }

      for (const [op, threshold] of Object.entries(operatorObj)) {
        if (op === '<' && !(value < threshold)) meetsCondition = false;
        else if (op === '>' && !(value > threshold)) meetsCondition = false;
        else if (op === '>=' && !(value >= threshold)) meetsCondition = false;
        else if (op === '<=' && !(value <= threshold)) meetsCondition = false;
        else if (op === '==' && !(value == threshold)) meetsCondition = false;
        else if (op === '!=' && !(value != threshold)) meetsCondition = false;
      }
      if (!meetsCondition) break;
    }

    if (meetsCondition) {
      return rule.nextScenarioTag;
    }
  }
  return null;
}
