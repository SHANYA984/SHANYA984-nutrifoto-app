// Estimación orientativa de energía para adultos.
// No diagnostica ni prescribe. Cuando hay condiciones de salud declaradas,
// la app evita convertir esta estimación en un objetivo automático de descenso.

const ACTIVITY_FACTORS = {
  sedentaria: 1.2,
  ligera: 1.375,
  moderada: 1.55,
  alta: 1.725
};

export function estimateEnergyReference(profile) {
  const age = Number(profile?.age);
  const weight = Number(profile?.weight);
  const height = Number(profile?.height);
  const activity = profile?.activity || 'moderada';

  if (![age, weight, height].every(Number.isFinite) || age < 18 || weight <= 0 || height <= 0) {
    return { status: 'incomplete', maintenanceKcal: null, planningKcal: null, requiresReview: true };
  }

  // Fórmula de Mifflin-St Jeor. El sexo biológico se solicita explícitamente
  // en la versión completa; sin ese dato no se fuerza una estimación.
  const sex = profile?.sex;
  if (sex !== 'female' && sex !== 'male') {
    return { status: 'needs_sex', maintenanceKcal: null, planningKcal: null, requiresReview: true };
  }

  const bmr = sex === 'female'
    ? (10 * weight) + (6.25 * height) - (5 * age) - 161
    : (10 * weight) + (6.25 * height) - (5 * age) + 5;

  const maintenanceKcal = Math.round(bmr * (ACTIVITY_FACTORS[activity] || 1.2));
  const hasDeclaredCondition = Boolean(String(profile?.conditions || '').trim());

  return {
    status: 'ok',
    maintenanceKcal,
    // Deliberadamente no calculamos un déficit automático cuando hay
    // condiciones declaradas. La app puede mostrar la referencia de mantenimiento
    // y pedir revisión profesional antes de proponer un objetivo de descenso.
    planningKcal: hasDeclaredCondition ? null : maintenanceKcal,
    requiresReview: hasDeclaredCondition,
    note: hasDeclaredCondition
      ? 'Hay condiciones de salud declaradas: no se genera un objetivo automático de descenso.'
      : 'Referencia energética orientativa; no es una indicación médica.'
  };
}
