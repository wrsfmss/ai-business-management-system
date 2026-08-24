const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');

const contracts = {
  runtime: ['src/runtime/index.js', 'src/runtime.js'],
  state: ['src/state/index.js', 'src/state.js'],
  eventBus: ['src/events/index.js', 'src/events/event-bus.js', 'src/event-bus.js'],
  commandBus: ['src/commands/index.js', 'src/commands/command-bus.js', 'src/command-bus.js'],
  mission: ['src/missions/index.js', 'src/missions/mission-lifecycle.js', 'src/mission-lifecycle.js'],
  memory: ['src/memory/index.js', 'src/memory/memory-store.js', 'src/memory.js'],
  scheduler: ['src/scheduler/index.js', 'src/scheduler/scheduler.js', 'src/scheduler.js'],
  electron: ['electron/main.js', 'src/electron/main.js', 'desktop/main.js']
};

function resolveContract(name) {
  const candidates = contracts[name];
  const found = candidates.find((relativePath) => fs.existsSync(path.join(repoRoot, relativePath)));
  return found ? path.join(repoRoot, found) : null;
}

function requireContract(name) {
  const resolved = resolveContract(name);
  if (!resolved) {
    throw new Error(
      `R37 integration seam missing: ${name}. Expected one of: ${contracts[name].join(', ')}`
    );
  }
  return require(resolved);
}

module.exports = { contracts, repoRoot, resolveContract, requireContract };
