class CommandBus {
  constructor({ missionEngine }) {
    this.missionEngine = missionEngine;
  }

  async submit(command, idempotencyKey) {
    const mission = await this.missionEngine.create(command, idempotencyKey);
    await this.missionEngine.execute(mission.id);
    return mission;
  }
}

module.exports = CommandBus;
