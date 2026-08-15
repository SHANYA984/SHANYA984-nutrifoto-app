const ADULT_MIN_AGE = 18;

export function validateProfile(profile) {
  const age = Number(profile?.age);
  return {
    isAdult: Number.isFinite(age) && age >= ADULT_MIN_AGE,
    warnings: Number.isFinite(age) && age < ADULT_MIN_AGE
      ? ['Nutrifoto está diseñada para personas adultas.']
      : []
  };
}

export function markAsEstimate(value) {
  return { value, label: 'estimación' };
}
