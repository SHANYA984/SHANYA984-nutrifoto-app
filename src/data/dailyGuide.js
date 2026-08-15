const baseMeals = [
  { type: 'Desayuno', options: ['Yogur natural + avena + una fruta.', 'Avena con leche o yogur + banana o manzana.', 'Pan integral + huevo + una fruta.'] },
  { type: 'Media mañana', options: ['Una fruta.', 'Yogur natural.', 'Fruta + un pequeño puñado de frutos secos.'] },
  { type: 'Almuerzo', options: ['Pollo, pescado, huevo o legumbres + verduras + arroz, papa o batata.', 'Carne magra + ensalada variada + papa.', 'Lentejas con verduras + ensalada.'] },
  { type: 'Merienda', options: ['Fruta + yogur.', 'Infusión + tostada integral con queso untable.', 'Yogur natural + fruta.'] },
  { type: 'Cena', options: ['Proteína + abundantes verduras.', 'Tortilla de verduras + ensalada.', 'Pescado o pollo + verduras + una porción de acompañamiento.'] }
];

const days = [
  ['Día 1 · Empezar sin complicarse', 'Organizar las comidas y sumar movimiento suave.', 'Caminata suave o moderada durante 30 minutos.'],
  ['Día 2 · Más variedad', 'Incorporar variedad de alimentos y mantener el movimiento.', 'Caminata de 30–45 minutos a un ritmo cómodo, adaptada a tu condición y rutina.'],
  ['Día 3 · Consolidar hábitos', 'Mantener una rutina realista que puedas repetir.', 'Buscá acumular movimiento durante el día. Una caminata de 30 minutos es una opción si resulta adecuada para vos.'],
  ['Día 4 · Priorizar verduras', 'Sumar variedad y alimentos nutritivos en las comidas principales.', 'Elegí una actividad que puedas sostener y realizala a un ritmo cómodo.'],
  ['Día 5 · Comer con organización', 'Planificar las comidas ayuda a tomar decisiones más simples.', 'Caminata u otra actividad moderada, adaptada a tu nivel.'],
  ['Día 6 · Mantener el ritmo', 'No necesitás hacerlo perfecto: buscá constancia.', 'Sumá movimiento durante el día según tus posibilidades.'],
  ['Día 7 · Revisar la semana', 'Reconocer qué hábitos te resultaron fáciles de mantener.', 'Elegí una actividad agradable y adecuada para vos.']
];

export const dailyGuides = Object.fromEntries(days.map(([title, focus, movement], index) => [index + 1, {
  title,
  focus,
  meals: baseMeals.map((meal, mealIndex) => ({ type: meal.type, text: meal.options[(index + mealIndex) % meal.options.length], options: meal.options })),
  movement,
  hydration: 'Tomá agua regularmente durante el día y usá tu sed como referencia.'
}]));

export function getDailyGuide(day = 1, goal = 'bienestar') {
  const guide = dailyGuides[((Number(day) - 1) % 7) + 1] || dailyGuides[1];
  const goalText = {
    bienestar: 'Objetivo: bienestar y hábitos sostenibles.',
    mantener: 'Objetivo: mantener hábitos de alimentación y movimiento.',
    organizar: 'Objetivo: organizar tus comidas y construir una rutina sostenible.',
    descenso: 'Objetivo: acompañar hábitos orientados al descenso de peso, sin metas extremas.'
  }[goal] || 'Objetivo: hábitos sostenibles.';
  return { ...guide, goalText };
}
