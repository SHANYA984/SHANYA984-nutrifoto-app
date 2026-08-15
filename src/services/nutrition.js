// Provider nutricional desacoplado. En producción se reemplaza el catálogo demo
// por una fuente nutricional validada sin modificar la interfaz de la aplicación.

const CATALOG = {
  'Plato de comida': { calories: 520, protein: 24, carbs: 58, fat: 20 },
  'Ensalada mixta': { calories: 180, protein: 5, carbs: 18, fat: 10 },
  'Arroz con pollo': { calories: 560, protein: 32, carbs: 62, fat: 18 },
  'Pasta': { calories: 480, protein: 16, carbs: 72, fat: 12 }
};

export function getNutritionEstimate(food, grams = 350) {
  const base = CATALOG[food] || CATALOG['Plato de comida'];
  const factor = Math.max(grams, 1) / 350;
  return {
    calories: Math.round(base.calories * factor),
    protein: Math.round(base.protein * factor),
    carbs: Math.round(base.carbs * factor),
    fat: Math.round(base.fat * factor),
    isEstimate: true
  };
}

export function listFoods() {
  return Object.keys(CATALOG);
}
