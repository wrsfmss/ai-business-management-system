const AIBusinessManagementServer = require('../src/index');

describe('R37 runtime boot integration', () => {
  test('loads the repository runtime without executing the transport', () => {
    expect(typeof AIBusinessManagementServer).toBe('function');
    const runtime = new AIBusinessManagementServer();
    expect(runtime).toBeDefined();
    expect(runtime.server).toBeDefined();
    expect(runtime.aiModelManager).toBeDefined();
    expect(runtime.businessOperations).toBeDefined();
    expect(runtime.executiveBoard).toBeDefined();
    expect(runtime.coordinationEngine).toBeDefined();
  });

  test('exposes an explicit R37 runtime seam', () => {
    const { requireContract } = require('./r37-contract');
    expect(() => requireContract('runtime')).not.toThrow();
  });
});
