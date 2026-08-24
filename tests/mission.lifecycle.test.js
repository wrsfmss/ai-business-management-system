const { requireContract } = require('./r37-contract');

describe('R37 mission lifecycle integration', () => {
  test('mission lifecycle seam exists and can be loaded', () => {
    const mission = requireContract('mission');
    expect(mission).toBeDefined();
  });

  test('mission lifecycle exposes transition semantics', () => {
    const mission = requireContract('mission');
    const api = mission.default || mission;
    const operations = ['start', 'pause', 'resume', 'complete', 'cancel', 'transition', 'create'];
    expect(operations.some((name) => typeof api[name] === 'function')).toBe(true);
  });
});
