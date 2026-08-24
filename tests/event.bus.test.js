const { requireContract } = require('./r37-contract');

describe('R37 event bus integration', () => {
  test('event bus seam exists and can be loaded', () => {
    const eventBus = requireContract('eventBus');
    expect(eventBus).toBeDefined();
  });

  test('event bus provides publish/subscribe semantics', () => {
    const eventBus = requireContract('eventBus');
    const api = eventBus.default || eventBus;
    expect(typeof api.publish === 'function' || typeof api.emit === 'function').toBe(true);
    expect(typeof api.subscribe === 'function' || typeof api.on === 'function').toBe(true);
  });
});
