const baseMeals = [
  { type: 'Desayuno', options: ['Yogur natural + avena + una fruta.', 'Avena con leche o yogur + banana o manzana.', 'Pan integral + huevo + una fruta.'] },
  { type: 'Media mañana', options: ['Una fruta.', 'Yogur natural.', 'Fruta + un pequeño puñado de frutos secos.'] },
  { type: 'Almuerzo', options: ['Pollo, pescado, huevo o legumbres + verduras + arroz, papa o batata.', 'Carne magra + ensalada variada + papa.', 'Lentejas con verduras + ensalada.'] },
  { type: 'Merienda', options: ['Fruta + yogur.', 'Infusión + tostada integral con queso untable.', 'Yogur natural + fruta.'] },
  { type: 'Cena', options: ['Proteína + abundantes verduras.', 'Tortilla de verduras + ensalada.', 'Pescado o pollo + verduras + una porción de acompañamiento.'] }
];

const days = [
  { title: 'Día 1 · Empezar sin complicarse', focus: 'Ordená tus horarios y empezá con comidas simples. El objetivo es construir una rutina que puedas repetir.', movement: 'Caminata suave o moderada durante 30 minutos, adaptada a tu condición y rutina.', fruit: 'Elegí 1–2 porciones de fruta repartidas durante el día.', hydration: 'Tomá agua regularmente durante el día y usá tu sed como referencia.', tip: 'Dejá preparada una fruta y una opción sencilla para la merienda.', mealShift: 0 },
  { title: 'Día 2 · Más variedad', focus: 'Variá colores y fuentes de proteína. No hace falta cambiar toda tu alimentación de una vez.', movement: 'Caminata de 30–45 minutos a un ritmo cómodo, adaptada a tu condición y rutina.', fruit: 'Combiná frutas diferentes según disponibilidad y preferencia.', hydration: 'Distribuí el consumo de agua durante el día, especialmente con las comidas.', tip: 'Intentá que el almuerzo y la cena incluyan verduras.', mealShift: 1 },
  { title: 'Día 3 · Consolidar hábitos', focus: 'Mantené una rutina realista. La constancia importa más que hacerlo perfecto.', movement: 'Buscá acumular movimiento durante el día. Una caminata de 30 minutos es una opción si resulta adecuada para vos.', fruit: 'Tené fruta visible y lista para consumir como alternativa práctica.', hydration: 'Tomá agua a lo largo del día sin esperar a tener mucha sed.', tip: 'Registrá con foto una comida y revisá las cantidades antes de guardarla.', mealShift: 2 },
  { title: 'Día 4 · Priorizar verduras', focus: 'Sumá variedad de verduras en las comidas principales y combiná texturas para que resulte más fácil sostener el hábito.', movement: 'Elegí una actividad que puedas sostener y realizala a un ritmo cómodo.', fruit: 'Elegí fruta entera como parte de tus colaciones cuando tengas hambre entre comidas.', hydration: 'Mantené una hidratación regular durante toda la jornada.', tip: 'Lavá o porcioná verduras y frutas con anticipación para facilitar las elecciones.', mealShift: 0 },
  { title: 'Día 5 · Comer con organización', focus: 'Planificar las comidas ayuda a tomar decisiones más simples y reduce la improvisación.', movement: 'Caminata u otra actividad moderada, adaptada a tu nivel y posibilidades.', fruit: 'Incluí fruta en desayuno, media mañana o merienda según tu rutina.', hydration: 'Tené agua disponible durante el trabajo, estudio o actividades del día.', tip: 'Anotá las comidas que querés preparar mañana para facilitar las compras.', mealShift: 1 },
  { title: 'Día 6 · Mantener el ritmo', focus: 'No necesitás hacerlo perfecto: buscá repetir los hábitos que te resultaron más fáciles.', movement: 'Sumá movimiento durante el día según tus posibilidades. Priorizá una intensidad cómoda.', fruit: 'Elegí las frutas que más disfrutás y alterná opciones para mantener variedad.', hydration: 'Continuá con hidratación regular y acompañá las comidas con agua.', tip: 'Revisá tu registro: qué comidas te resultaron fáciles y cuáles necesitás organizar mejor.', mealShift: 2 },
  { title: 'Día 7 · Revisar la semana', focus: 'Reconocé qué hábitos fueron fáciles de mantener y elegí cuáles querés continuar la próxima semana.', movement: 'Elegí una actividad agradable y adecuada para vos. El objetivo es cerrar la semana con movimiento sostenible.', fruit: 'Mantené la variedad de frutas que mejor se adapte a tus gustos y disponibilidad.', hydration: 'Seguí tomando agua regularmente y observá tus propios hábitos de hidratación.', tip: 'Completá tu resumen semanal y usalo para planificar los próximos días.', mealShift: 0 }
];

export const dailyGuides = Object.fromEntries(days.map((day, index) => [index + 1, {
  title: day.title,
  focus: day.focus,
  meals: baseMeals.map((meal, mealIndex) => ({ type: meal.type, text: meal.options[(day.mealShift + mealIndex) % meal.options.length], options: meal.options })),
  movement: day.movement,
  hydration: day.hydration,
  fruit: day.fruit,
  tip: day.tip
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
