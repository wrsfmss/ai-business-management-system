const { randomUUID } = require('crypto');

const TRANSITIONS = {
  created: ['queued', 'cancelled'],
  queued: ['running', 'cancelled'],
  running: ['completed', 'failed', 'cancelled'],
  completed: [], failed: [], cancelled: []
};

class MissionEngine {
  constructor({ stateStore, eventBus, executor = async () => ({ ok: true }) }) {
    this.stateStore = stateStore;
    this.eventBus = eventBus;
    this.executor = executor;
    this.missions = stateStore.get('missions', {});
    this.inFlight = new Set();
  }

  async create(command, idempotencyKey = randomUUID()) {
    const existing = Object.values(this.missions).find(m => m.idempotencyKey === idempotencyKey);
    if (existing) return existing;
    const mission = {
      id: randomUUID(), idempotencyKey, command,
      status: 'created', executionCount: 0,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    };
    this.missions[mission.id] = mission;
    await this.persist();
    await this.eventBus.publish('mission.created', { missionId: mission.id });
    return mission;
  }

  async transition(id, next) {
    const mission = this.missions[id];
    if (!mission) throw new Error(`Mission not found: ${id}`);
    if (!TRANSITIONS[mission.status].includes(next)) throw new Error(`Invalid transition ${mission.status} -> ${next}`);
    mission.status = next;
    mission.updatedAt = new Date().toISOString();
    await this.persist();
    await this.eventBus.publish('mission.state_changed', { missionId: id, status: next });
    return mission;
  }

  async execute(id) {
    const mission = this.missions[id];
    if (!mission) throw new Error(`Mission not found: ${id}`);
    if (mission.status === 'completed') return mission;
    if (this.inFlight.has(id)) return mission;
    this.inFlight.add(id);
    try {
      if (mission.status === 'created') await this.transition(id, 'queued');
      if (mission.status === 'queued') await this.transition(id, 'running');
      mission.executionCount += 1;
      await this.persist();
      await this.eventBus.publish('mission.execution_started', { missionId: id, executionCount: mission.executionCount });
      const result = await this.executor(mission.command, mission);
      mission.result = result;
      await this.transition(id, 'completed');
      await this.eventBus.publish('mission.completed', { missionId: id, result });
      return mission;
    } catch (error) {
      mission.error = error.message;
      if (mission.status === 'running') await this.transition(id, 'failed');
      throw error;
    } finally { this.inFlight.delete(id); }
  }

  async persist() {
    this.stateStore.set('missions', this.missions);
    await this.stateStore.save();
  }

  get(id) { return this.missions[id]; }
  all() { return Object.values(this.missions); }
}

module.exports = { MissionEngine, TRANSITIONS };
