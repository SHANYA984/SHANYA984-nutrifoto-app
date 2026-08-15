export function summarizeDay(meals = [], activities = [], date = new Date()) {
  const day = new Date(date).toISOString().slice(0, 10);
  const dayMeals = meals.filter((meal) => String(meal.date || '').slice(0, 10) === day);
  const dayActivities = activities.filter((entry) => String(entry.date || entry.dateTime || '').slice(0, 10) === day);

  return {
    date: day,
    mealCount: dayMeals.length,
    calories: dayMeals.reduce((sum, meal) => sum + Number(meal.calories || 0), 0),
    protein: dayMeals.reduce((sum, meal) => sum + Number(meal.protein || 0), 0),
    carbs: dayMeals.reduce((sum, meal) => sum + Number(meal.carbs || 0), 0),
    fat: dayMeals.reduce((sum, meal) => sum + Number(meal.fat || 0), 0),
    activityMinutes: dayActivities.reduce((sum, entry) => sum + Number(entry.durationMinutes || 0), 0)
  };
}
