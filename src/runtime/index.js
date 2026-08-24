const AIBusinessManagementServer = require('../index');

/**
 * R37 runtime seam. Keeps construction separate from transport startup so the
 * integration harness can boot the application without opening stdio.
 */
function createRuntime(options = {}) {
  const runtime = new AIBusinessManagementServer();
  runtime.runtimeOptions = { ...options };
  return runtime;
}

async function startRuntime(options = {}) {
  const runtime = createRuntime(options);
  await runtime.start();
  return runtime;
}

module.exports = {
  createRuntime,
  startRuntime,
  AIBusinessManagementServer
};
