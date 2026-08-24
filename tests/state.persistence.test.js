const path = require('path');
const os = require('os');
const fs = require('fs/promises');
const StateStore = require('../src/state');

describe('R37 state persistence integration', () => {
  let filePath;

  beforeEach(() => {
    filePath = path.join(os.tmpdir(), `r37-state-${process.pid}-${Date.now()}-${Math.random()}.json`);
  });

  afterEach(async () => {
    await fs.rm(filePath, { force: true });
    await fs.rm(`${filePath}.tmp`, { force: true });
  });

  test('persists state and restores it in a new store instance', async () => {
    const first = new StateStore({ filePath });
    first.set('mission', { id: 'm-37', status: 'running' });
    await first.save();

    const second = new StateStore({ filePath });
    await second.load();

    expect(second.get('mission')).toEqual({ id: 'm-37', status: 'running' });
  });

  test('does not leave a partially written state file on successful save', async () => {
    const store = new StateStore({ filePath });
    store.set('healthy', true);
    await store.save();

    await expect(fs.access(filePath)).resolves.toBeUndefined();
    await expect(fs.access(`${filePath}.tmp`)).rejects.toMatchObject({ code: 'ENOENT' });
  });
});
