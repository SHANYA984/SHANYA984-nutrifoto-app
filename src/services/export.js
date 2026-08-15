export function exportMealsAsJson(meals = []) {
  const payload = {
    app: 'Nutrifoto',
    version: 1,
    exportedAt: new Date().toISOString(),
    meals
  };
  return JSON.stringify(payload, null, 2);
}

export function downloadTextFile(filename, content, type = 'application/json') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
