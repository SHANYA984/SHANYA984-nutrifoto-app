export const dailyGuides = {
  1: {
    title: 'Día 1 · Empezar sin complicarse',
    focus: 'Organizar las comidas y sumar movimiento suave.',
    meals: [
      { type: 'Desayuno', text: 'Yogur natural + avena + una fruta. Agua o infusión sin azúcar.' },
      { type: 'Media mañana', text: 'Una fruta o yogur natural, según hambre y horario.' },
      { type: 'Almuerzo', text: 'Pollo, pescado, huevo o legumbres + abundantes verduras + una porción de arroz, papa u otro carbohidrato.' },
      { type: 'Merienda', text: 'Fruta + yogur, o una opción equivalente que te resulte práctica.' },
      { type: 'Cena', text: 'Una fuente de proteína + verduras. Ajustá la cantidad a tu hambre y necesidades.' }
    ],
    movement: 'Caminata suave o moderada durante 30 minutos. Si ya tenés un nivel mayor de actividad, adaptá la duración a tu rutina.',
    hydration: 'Tomá agua regularmente durante el día y usá tu sed como referencia.'
  },
  2: {
    title: 'Día 2 · Más variedad',
    focus: 'Incorporar variedad de alimentos y mantener el movimiento.',
    meals: [
      { type: 'Desayuno', text: 'Avena con leche o yogur + banana o manzana + semillas.' },
      { type: 'Media mañana', text: 'Una fruta o un puñado pequeño de frutos secos.' },
      { type: 'Almuerzo', text: 'Carne magra, pollo o legumbres + ensalada variada + papa, arroz o batata.' },
      { type: 'Merienda', text: 'Yogur natural + fruta.' },
      { type: 'Cena', text: 'Tortilla de verduras con huevo + ensalada, o una alternativa equivalente.' }
    ],
    movement: 'Caminata de 30–45 minutos a un ritmo cómodo, adaptada a tu condición y rutina.',
    hydration: 'Mantené una hidratación regular durante el día.'
  },
  3: {
    title: 'Día 3 · Consolidar hábitos',
    focus: 'Mantener una rutina realista que puedas repetir.',
    meals: [
      { type: 'Desayuno', text: 'Yogur natural + fruta + avena o pan integral.' },
      { type: 'Media mañana', text: 'Fruta, yogur o simplemente agua si no tenés hambre.' },
      { type: 'Almuerzo', text: 'Pescado, pollo, huevo o legumbres + verduras + una porción de carbohidrato.' },
      { type: 'Merienda', text: 'Infusión + tostada integral con queso untable, o yogur con fruta.' },
      { type: 'Cena', text: 'Verduras + proteína a elección. Priorizá una preparación sencilla.' }
    ],
    movement: 'Buscá acumular movimiento durante el día. Una caminata de 30 minutos es una opción si resulta adecuada para vos.',
    hydration: 'Tomá agua a lo largo del día.'
  }
};

export function getDailyGuide(day = 1) {
  return dailyGuides[day] || dailyGuides[1];
}
