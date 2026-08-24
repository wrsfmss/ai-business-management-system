const { requireContract } = require('./r37-contract');

describe('R37 command bus integration', () => {
  test('command bus seam exists and can be loaded', () => {
    const commandBus = requireContract('commandBus');
    expect(commandBus).toBeDefined();
  });

  test('command bus exposes dispatch semantics', () => {
    const commandBus = requireContract('commandBus');
    const api = commandBus.default || commandBus;
    expect(typeof api.dispatch === 'function' || typeof api.execute === 'function' || typeof api.send === 'function').toBe(true);
  });
});
