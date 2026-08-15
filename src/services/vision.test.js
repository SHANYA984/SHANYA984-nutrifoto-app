import assert from 'node:assert/strict';
import test from 'node:test';
import { createVisionProvider, normalizeVisionResult } from './vision.js';

test('normalizeVisionResult clamps invalid nutrition values', () => {
  const result = normalizeVisionResult({
    items: [{
      name: '  ',
      confidence: 4,
      portionGrams: -20,
      calories: '120',
      protein: 'bad',
      carbs: null,
      fat: 15
    }]
  });

  assert.equal(result.items[0].name, 'Alimento no identificado');
  assert.equal(result.items[0].confidence, 1);
  assert.equal(result.items[0].portionGrams, 0);
  assert.equal(result.items[0].calories, 120);
  assert.equal(result.items[0].protein, 0);
  assert.equal(result.items[0].carbs, 0);
  assert.equal(result.items[0].fat, 15);
  assert.equal(result.isEstimate, true);
});

test('createVisionProvider uses an injected adapter without network access', async () => {
  const provider = createVisionProvider({
    async analyzeImage() {
      return { items: [{ name: 'Manzana', calories: 80 }], provider: 'test' };
    }
  });

  const result = await provider.analyzeImage('data:image/png;base64,test');
  assert.equal(result.provider, 'test');
  assert.equal(result.items[0].name, 'Manzana');
  assert.equal(result.items[0].calories, 80);
});

test('createVisionProvider rejects an empty image', async () => {
  const provider = createVisionProvider();
  await assert.rejects(() => provider.analyzeImage(''), { message: 'image_required' });
});
