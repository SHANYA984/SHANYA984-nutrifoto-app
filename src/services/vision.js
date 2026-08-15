// Contrato del proveedor de visión. No contiene credenciales ni llama a un servicio externo.
// El backend podrá implementar analyzeImage() con el proveedor de IA elegido.

export function createVisionProvider(adapter = null) {
  return {
    async analyzeImage(image) {
      if (!image) throw new Error('image_required');
      if (adapter?.analyzeImage) return adapter.analyzeImage(image);
      return {
        items: [{ name: 'Plato de comida', confidence: null }],
        portionGrams: 350,
        isEstimate: true,
        provider: 'demo'
      };
    }
  };
}
