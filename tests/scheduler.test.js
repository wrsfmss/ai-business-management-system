const fs = require('fs');
const os = require('os');
const path = require('path');
const StateStore = require('../src/runtime/state-store');
const EventBus = require('../src/runtime/event-bus');
const Scheduler = require('../src/runtime/scheduler');

describe('durable scheduler', () => {
  let dir;
  let store;
  let events;
  let scheduler;

  beforeEach(async () => {
    dir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'brahma-scheduler-'));
    store = new StateStore(path.join(dir, 'state.json'));
    await store.load();
    events = new EventBus();
    scheduler = new Scheduler({ stateStore: store, eventBus: events });
  });

  afterEach(async () => {
    await fs.promises.rm(dir, { recursive: true, force: true });
  });

  test('persists a scheduled job and restores it', async () => {
    const runAt = new Date(Date.now() + 1000).toISOString();
    const job = await scheduler.schedule({
      id: 'job-1',
      runAt,
      command: { type: 'test.command', payload: { value: 42 } }
    });

    expect(job.status).toBe('scheduled');

    const restoredStore = new StateStore(path.join(dir, 'state.json'));
    await restoredStore.load();
    const restored = new Scheduler({ stateStore: restoredStore, eventBus: new EventBus() });
    expect(restored.list()).toEqual([job]);
  });

  test('executes once and records completion', async () => {
    const runAt = new Date(Date.now() + 25).toISOString();
    await scheduler.schedule({
      id: 'job-2',
      runAt,
      command: { type: 'test.command' },
      idempotencyKey: 'schedule-test-2'
    });

    const submitted = [];
    await scheduler.restore(async (command, key) => {
      submitted.push({ command, key });
      return { ok: true };
    });

    await new Promise(resolve => setTimeout(resolve, 75));
    const job = scheduler.list()[0];
    expect(submitted).toHaveLength(1);
    expect(submitted[0].key).toBe('schedule-test-2');
    expect(job.status).toBe('completed');
    expect(job.result).toEqual({ ok: true });
    expect(events.getHistory().map(event => event.type)).toEqual([
      'scheduler.job.scheduled',
      'scheduler.job.started',
      'scheduler.job.completed'
    ]);
  });

  test('cancels a pending job', async () => {
    const job = await scheduler.schedule({
      id: 'job-3',
      runAt: new Date(Date.now() + 5000).toISOString(),
      command: { type: 'test.command' }
    });
    const cancelled = await scheduler.cancel(job.id);
    expect(cancelled.status).toBe('cancelled');
    expect(scheduler.list()[0].status).toBe('cancelled');
  });
});
