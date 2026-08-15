export function validateMealItem(item = {}) {
  const errors = [];
  if (!String(item.name ?? '').trim()) errors.push('name_required');
  for (const key of ['portionGrams', 'calories', 'protein', 'carbs', 'fat']) {
    const value = Number(item[key]);
    if (!Number.isFinite(value) || value < 0) errors.push(`${key}_invalid`);
  }
  return { ok: errors.length === 0, errors };
}

export function validateMeal(meal = {}) {
  if (!Array.isArray(meal.items) || meal.items.length === 0) {
    return { ok: false, errors: ['items_required'] };
  }
  const itemErrors = meal.items.flatMap((item, index) =>
    validateMealItem(item).errors.map((error) => `items.${index}.${error}`)
  );
  return { ok: itemErrors.length === 0, errors: itemErrors };
}

export function validateImageFile(file) {
  if (!file) return { ok: false, error: 'image_required' };
  if (!String(file.type || '').startsWith('image/')) return { ok: false, error: 'image_type_invalid' };
  if (Number(file.size || 0) > 8 * 1024 * 1024) return { ok: false, error: 'image_too_large' };
  return { ok: true };
}
