const path = require('path');
const EventBus = require('./event-bus');
const StateStore = require('./state-store');
const MemoryStore = require('./memory-store');
const { MissionEngine } = require('./mission-engine');
const CommandBus = require('./command-bus');
const Scheduler = require('./scheduler');

class Runtime {
  constructor(options = {}) {
    this.stateStore = new StateStore(options.statePath || path.join(process.cwd(), '.runtime', 'state.json'));
    this.eventBus = new EventBus();
    this.memory = null;
    this.missions = null;
    this.commands = null;
    this.scheduler = null;
    this.executor = options.executor || (async command => ({ ok: true, command }));
    this.ready = false;
  }

  async boot() {
    if (this.ready) return this;
    await this.stateStore.load();
    this.memory = new MemoryStore(this.stateStore);
    this.missions = new MissionEngine({ stateStore: this.stateStore, eventBus: this.eventBus, executor: this.executor });
    this.commands = new CommandBus({ missionEngine: this.missions });
    this.scheduler = new Scheduler({ stateStore: this.stateStore, eventBus: this.eventBus });
    this.ready = true;
    await this.scheduler.restore((command, idempotencyKey) => this.submit(command, idempotencyKey));
    await this.eventBus.publish('runtime.ready');
    return this;
  }

  async shutdown() {
    if (!this.ready) return;
    await this.stateStore.save();
    this.ready = false;
  }

  assertReady() { if (!this.ready) throw new Error('Runtime is not ready'); }
  async submit(command, idempotencyKey) { this.assertReady(); return this.commands.submit(command, idempotencyKey); }
  async schedule(input) { this.assertReady(); return this.scheduler.schedule(input); }
  async cancelSchedule(id) { this.assertReady(); return this.scheduler.cancel(id); }
  listSchedules() { this.assertReady(); return this.scheduler.list(); }
}

module.exports = Runtime;
