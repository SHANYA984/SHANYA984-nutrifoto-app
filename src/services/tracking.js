import { track } from '@vercel/analytics';

const EVENTS = {
  trialStarted: 'inicio_prueba',
  objectiveSelected: 'objetivo_seleccionado',
  guideOpened: 'guia_abierta',
  photoStarted: 'foto_iniciada',
  mealRegistered: 'comida_registrada',
  nextDay: 'dia_siguiente',
  trialFinished: 'prueba_finalizada',
  plusViewed: 'plus_visto',
  plusInterest: 'interes_plus',
};

export function trackEvent(name, data = {}) {
  try {
    const safeData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => ['string', 'number', 'boolean'].includes(typeof value))
    );
    return track(name, safeData);
  } catch {
    return undefined;
  }
}

export { EVENTS };
