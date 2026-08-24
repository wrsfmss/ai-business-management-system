const AIBusinessManagementServer = require('../src/index');
const { createRuntime } = require('../src/runtime');

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

  test('creates the runtime through the explicit R37 seam', () => {
    const runtime = createRuntime({ testMode: true });
    expect(runtime).toBeInstanceOf(AIBusinessManagementServer);
    expect(runtime.runtimeOptions).toEqual({ testMode: true });
  });
});
