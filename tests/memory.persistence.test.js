const { requireContract } = require('./r37-contract');

describe('R37 memory persistence integration', () => {
  test('memory seam exists and can be loaded', () => {
    const memory = requireContract('memory');
    expect(memory).toBeDefined();
  });

  test('memory contract exposes write/read semantics', () => {
    const memory = requireContract('memory');
    const api = memory.default || memory;
    const writes = ['set', 'put', 'store', 'remember', 'save'];
    const reads = ['get', 'retrieve', 'recall', 'load', 'search'];
    expect(writes.some((name) => typeof api[name] === 'function')).toBe(true);
    expect(reads.some((name) => typeof api[name] === 'function')).toBe(true);
  });
});
