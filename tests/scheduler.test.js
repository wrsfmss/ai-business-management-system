const { requireContract } = require('./r37-contract');

describe('R37 scheduler integration', () => {
  test('scheduler seam exists and can be loaded', () => {
    const scheduler = requireContract('scheduler');
    expect(scheduler).toBeDefined();
  });

  test('scheduler exposes scheduling and cancellation semantics', () => {
    const scheduler = requireContract('scheduler');
    const api = scheduler.default || scheduler;
    const scheduleOps = ['schedule', 'enqueue', 'add', 'register'];
    const cancelOps = ['cancel', 'remove', 'unschedule'];
    expect(scheduleOps.some((name) => typeof api[name] === 'function')).toBe(true);
    expect(cancelOps.some((name) => typeof api[name] === 'function')).toBe(true);
  });
});
