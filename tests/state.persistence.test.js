const { requireContract } = require('./r37-contract');

describe('R37 state persistence integration', () => {
  test('state persistence seam exists and can be loaded', () => {
    const state = requireContract('state');
    expect(state).toBeDefined();
  });

  test('state contract exposes persistence operations', () => {
    const state = requireContract('state');
    const api = state.default || state;
    const operations = ['get', 'set', 'save', 'load', 'persist', 'restore'];
    expect(operations.some((name) => typeof api[name] === 'function')).toBe(true);
  });
});
