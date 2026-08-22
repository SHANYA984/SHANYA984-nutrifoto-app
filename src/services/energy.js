const ACTIVITY_FACTORS = {
  sedentaria: 1.2,
  ligera: 1.375,
  moderada: 1.55,
  alta: 1.725
};

export function calculateEnergyPlan(profile = {}) {
  const age = Number(profile?.age);
  const weight = Number(profile?.weight);
  const height = Number(profile?.height);
  const activity = profile?.activity || 'moderada';
  const sex = profile?.sex;
  const goal = profile?.goal || 'bienestar';
  const hasDeclaredCondition = Boolean(String(profile?.conditions || '').trim());

  if (![age, weight, height].every(Number.isFinite) || age < 18 || weight <= 0 || height <= 0 || !['female','male'].includes(sex)) {
    return {
      target: null,
      maintenanceKcal: null,
      proteinTarget: null,
      carbTarget: null,
      fatTarget: null,
      message: 'Completá edad, sexo, peso, altura, actividad y objetivo para obtener una estimación orientativa.'
    };
  }

  // Mifflin-St Jeor: referencia energética, no diagnóstico ni prescripción.
  const bmr = sex === 'female'
    ? (10 * weight) + (6.25 * height) - (5 * age) - 161
    : (10 * weight) + (6.25 * height) - (5 * age) + 5;
  const maintenanceKcal = Math.round(bmr * (ACTIVITY_FACTORS[activity] || 1.2));

  // Cuando hay condiciones declaradas, no automatizamos un déficit.
  const target = goal === 'descenso' && !hasDeclaredCondition
    ? Math.max(1200, Math.round(maintenanceKcal * 0.9))
    : maintenanceKcal;

  const proteinTarget = Math.round(weight * 1.0);
  const fatTarget = Math.round((target * 0.30) / 9);
  const carbTarget = Math.max(0, Math.round((target - proteinTarget * 4 - fatTarget * 9) / 4));

  let message = 'Estimación orientativa basada en tu perfil y nivel de actividad.';
  if (goal === 'descenso' && hasDeclaredCondition) {
    message = 'Hay una condición declarada: se muestra una referencia de mantenimiento y no se automatiza un déficit. Conviene validar el objetivo con un profesional.';
  } else if (goal === 'descenso') {
    message = 'Objetivo orientativo para descenso gradual. No es una indicación médica.';
  }

  return { target, maintenanceKcal, proteinTarget, carbTarget, fatTarget, message };
}

export function estimateEnergyReference(profile) {
  const plan = calculateEnergyPlan(profile);
  return {
    status: plan.target ? 'ok' : 'incomplete',
    maintenanceKcal: plan.maintenanceKcal,
    planningKcal: plan.target,
    requiresReview: Boolean(String(profile?.conditions || '').trim())
  };
}
