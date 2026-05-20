const test = require('node:test');
const assert = require('node:assert/strict');

const { getOptimizedBannerUrl } = require('../shared/utils/banner');

test('optimizes banner urls for pexels images', () => {
  const source = 'https://images.pexels.com/photos/1629236/pexels-photo-1629236.jpeg?cs=srgb&dl=pexels-suzyhazelwood-1629236.jpg&fm=jpg';
  const result = getOptimizedBannerUrl(source, 720);

  assert.match(result, /auto=compress/);
  assert.match(result, /cs=tinysrgb/);
  assert.match(result, /fit=crop/);
  assert.match(result, /w=720/);
});

test('returns an empty string when no banner url is available', () => {
  assert.equal(getOptimizedBannerUrl(undefined, 720), '');
  assert.equal(getOptimizedBannerUrl(null, 720), '');
});