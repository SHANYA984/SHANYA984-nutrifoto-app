// Contrato del proveedor de visión. El cliente no contiene credenciales.
// En producción, el adapter debe apuntar a un backend seguro.

export function createVisionProvider(adapter = null) {
  return {
    async analyzeImage(image) {
      if (!image) throw new Error('image_required');
      if (adapter?.analyzeImage) return adapter.analyzeImage(image);
      return {
        items: [{ name: 'Plato de comida', confidence: null }],
        portionGrams: 350,
        calories: 520,
        protein: 24,
        carbs: 58,
        fat: 20,
        isEstimate: true,
        provider: 'demo'
      };
    }
  };
}
