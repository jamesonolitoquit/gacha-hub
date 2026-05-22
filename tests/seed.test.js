const assert = require('assert');
const { test } = require('node:test');
const { validatePrunedSeeds } = require('../scripts/validate-seeds');

test('pruned seed files validate', () => {
  const res = validatePrunedSeeds();
  if (!res.ok) {
    console.error('Seed problems:', res.problems);
  }
  assert.strictEqual(res.ok, true, 'Pruned seed validation failed; see console for details');
});
