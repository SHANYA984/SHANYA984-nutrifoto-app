// Contrato del proveedor de visión. El cliente no contiene credenciales.
// En producción, el adapter debe apuntar a un backend seguro.

export function normalizeVisionResult(result) {
  if (!result) return null;

  const items = Array.isArray(result.items) ? result.items.map((item) => ({
    name: String(item?.name ?? 'Alimento no identificado'),
    confidence: item?.confidence ?? null,
    portionGrams: Number(item?.portionGrams ?? 0),
    calories: Number(item?.calories ?? 0),
    protein: Number(item?.protein ?? 0),
    carbs: Number(item?.carbs ?? 0),
    fat: Number(item?.fat ?? 0)
  })) : [];

  return {
    items,
    isEstimate: result.isEstimate !== false,
    provider: result.provider ?? 'unknown'
  };
}

export function createVisionProvider(adapter = null) {
  return {
    async analyzeImage(image) {
      if (!image) throw new Error('image_required');
      const result = adapter?.analyzeImage
        ? await adapter.analyzeImage(image)
        : {
            items: [{
              name: 'Plato de comida',
              confidence: null,
              portionGrams: 350,
              calories: 520,
              protein: 24,
              carbs: 58,
              fat: 20
            }],
            isEstimate: true,
            provider: 'demo'
          };

      return normalizeVisionResult(result);
    }
  };
}
