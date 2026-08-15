export function getPersonalization(profile = {}) {
  const activity = profile.activity || 'moderada';
  const goal = profile.goal || 'bienestar';
  const conditions = String(profile.conditions || '').trim();

  const messages = [];
  if (goal === 'organizar') messages.push('Priorizá regularidad y registro de tus comidas.');
  if (goal === 'mantener') messages.push('Usá el registro para observar la constancia de tus hábitos.');
  if (goal === 'bienestar') messages.push('Priorizá variedad, regularidad y hábitos sostenibles.');
  if (activity === 'alta') messages.push('Registrá también tu actividad para interpretar mejor tu día.');
  if (activity === 'ligera') messages.push('El registro de movimiento ayuda a contextualizar tu actividad diaria.');
  if (conditions) messages.push('La información declarada requiere recomendaciones prudentes y no constituye diagnóstico.');

  return { goal, activity, hasDeclaredConditions: Boolean(conditions), messages };
}

export function getMealContext(profile, meal) {
  const personalization = getPersonalization(profile);
  return {
    ...personalization,
    mealCalories: Number(meal?.calories || 0),
    mealIsEstimate: meal?.isEstimate !== false
  };
}
