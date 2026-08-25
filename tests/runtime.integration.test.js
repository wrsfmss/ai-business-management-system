const fs = require('fs');
const os = require('os');
const path = require('path');
const Runtime = require('../src/runtime/runtime');
const EventBus = require('../src/runtime/event-bus');

const tempState = () => path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'brahma-r37-')), 'state.json');

describe('R37 runtime integration harness', () => {
  test('boots and publishes readiness', async () => {
    const runtime = await new Runtime({ statePath: tempState() }).boot();
    expect(runtime.ready).toBe(true);
    expect(runtime.eventBus.getHistory().map(e => e.type)).toContain('runtime.ready');
    await runtime.shutdown();
  });

  test('persists mission and recovers it after restart', async () => {
    const statePath = tempState();
    const first = await new Runtime({ statePath }).boot();
    const mission = await first.submit({ type: 'test.command', value: 'hello' }, 'r37-1');
    expect(mission.status).toBe('completed');
    await first.shutdown();

    const second = await new Runtime({ statePath }).boot();
    expect(second.missions.get(mission.id).status).toBe('completed');
    expect(second.missions.get(mission.id).executionCount).toBe(1);
    await second.shutdown();
  });

  test('repeated idempotency key does not execute twice', async () => {
    const statePath = tempState();
    let executions = 0;
    const runtime = await new Runtime({ statePath, executor: async () => ({ ok: ++executions }) }).boot();
    const a = await runtime.submit({ type: 'test.command' }, 'same-key');
    const b = await runtime.submit({ type: 'test.command' }, 'same-key');
    expect(a.id).toBe(b.id);
    expect(executions).toBe(1);
    expect(a.executionCount).toBe(1);
    await runtime.shutdown();
  });

  test('event bus preserves publication order', async () => {
    const bus = new EventBus();
    const seen = [];
    bus.subscribe('test', event => seen.push(event.payload.n));
    await bus.publish('test', { n: 1 });
    await bus.publish('test', { n: 2 });
    await bus.publish('test', { n: 3 });
    expect(seen).toEqual([1, 2, 3]);
  });
});
