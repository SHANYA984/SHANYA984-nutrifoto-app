// Cliente de visión. Nunca contiene credenciales del proveedor.
// En producción, /api/analyze actúa como proxy seguro del proveedor de IA.

function nonNegativeNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : fallback;
}

export function normalizeVisionResult(result) {
  if (!result || typeof result !== 'object') return null;

  const rawItems = Array.isArray(result.items) ? result.items : [];
  const items = rawItems.map((item) => ({
    name: String(item?.name ?? 'Alimento no identificado').trim() || 'Alimento no identificado',
    confidence: item?.confidence == null ? null : Math.min(1, Math.max(0, nonNegativeNumber(item.confidence))),
    portionGrams: nonNegativeNumber(item?.portionGrams),
    calories: nonNegativeNumber(item?.calories),
    protein: nonNegativeNumber(item?.protein),
    carbs: nonNegativeNumber(item?.carbs),
    fat: nonNegativeNumber(item?.fat)
  }));

  return {
    items,
    isEstimate: result.isEstimate !== false,
    provider: String(result.provider ?? 'unknown')
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
