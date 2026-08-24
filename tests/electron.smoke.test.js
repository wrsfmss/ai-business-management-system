const { requireContract } = require('./r37-contract');

describe('R37 Electron smoke integration', () => {
  test('Electron entrypoint exists and can be loaded', () => {
    const electron = requireContract('electron');
    expect(electron).toBeDefined();
  });

  test('desktop entrypoint exposes an application lifecycle hook', () => {
    const electron = requireContract('electron');
    const api = electron.default || electron;
    const lifecycle = ['start', 'launch', 'createWindow', 'ready', 'init'];
    expect(lifecycle.some((name) => typeof api[name] === 'function')).toBe(true);
  });
});
