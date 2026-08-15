// Cliente de visión. Nunca contiene credenciales del proveedor.
// En producción, /api/analyze actúa como proxy seguro del proveedor de IA.

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
        : await analyzeThroughBackend(image);

      return normalizeVisionResult(result);
    }
  };
}

async function analyzeThroughBackend(image) {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image })
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    const error = new Error(payload.error || 'vision_analysis_failed');
    error.status = response.status;
    throw error;
  }

  return response.json();
}
