// Cliente de visión. Nunca contiene credenciales del proveedor.
// En producción, /api/analyze actúa como proxy seguro del proveedor de IA.
// Si todavía no hay proveedor configurado, se usa un resultado de demostración
// local para poder probar todo el flujo de la app sin generar costos.

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
    provider: String(result.provider ?? 'unknown'),
    isDemo: result.isDemo === true
  };
}

export function createVisionProvider(adapter = null) {
  return {
    async analyzeImage(image) {
      if (!image) throw new Error('image_required');

      if (adapter?.analyzeImage) {
        return normalizeVisionResult(await adapter.analyzeImage(image));
      }

      try {
        return normalizeVisionResult(await analyzeThroughBackend(image));
      } catch (error) {
        // El modo demo permite probar la app completa sin una API de IA paga.
        // No pretende identificar la fotografía: entrega datos editables de ejemplo.
        if (error?.message === 'vision_provider_not_configured' || error?.status === 503) {
          return normalizeVisionResult({
            provider: 'demo-local',
            isEstimate: true,
            isDemo: true,
            items: [
              {
                name: 'Comida de ejemplo',
                confidence: null,
                portionGrams: 300,
                calories: 450,
                protein: 20,
                carbs: 55,
                fat: 16
              }
            ]
          });
        }
        throw error;
      }
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
