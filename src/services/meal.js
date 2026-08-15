export function createMealFromAnalysis(analysis) {
  if (!analysis?.items?.length) throw new Error('analysis_empty');

  const totals = analysis.items.reduce((acc, item) => ({
    calories: acc.calories + Number(item.calories || 0),
    protein: acc.protein + Number(item.protein || 0),
    carbs: acc.carbs + Number(item.carbs || 0),
    fat: acc.fat + Number(item.fat || 0)
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  return {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    items: analysis.items,
    ...totals,
    isEstimate: true
  };
}

export function updateMealItem(meal, index, patch) {
  if (!meal?.items?.[index]) return meal;
  const items = meal.items.map((item, i) => i === index ? { ...item, ...patch } : item);
  const totals = items.reduce((acc, item) => ({
    calories: acc.calories + Number(item.calories || 0),
    protein: acc.protein + Number(item.protein || 0),
    carbs: acc.carbs + Number(item.carbs || 0),
    fat: acc.fat + Number(item.fat || 0)
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  return { ...meal, items, ...totals };
}
