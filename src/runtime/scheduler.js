class Scheduler {
  constructor({ stateStore, eventBus, clock = () => Date.now() } = {}) {
    if (!stateStore) throw new Error('Scheduler requires stateStore');
    if (!eventBus) throw new Error('Scheduler requires eventBus');
    this.stateStore = stateStore;
    this.eventBus = eventBus;
    this.clock = clock;
    this.timers = new Map();
    this.nextId = 1;
  }

  _jobs() {
    const jobs = this.stateStore.get('scheduler.jobs', {});
    this.stateStore.set('scheduler.jobs', jobs);
    return jobs;
  }

  async schedule({ id, runAt, command, idempotencyKey }) {
    if (!command) throw new Error('Scheduled command is required');
    const timestamp = new Date(runAt).getTime();
    if (!Number.isFinite(timestamp)) throw new Error('runAt must be a valid date');
    if (timestamp < this.clock()) throw new Error('runAt must be in the future');

    const jobId = id || `job-${this.nextId++}`;
    const jobs = this._jobs();
    if (jobs[jobId]) throw new Error(`Scheduled job already exists: ${jobId}`);

    jobs[jobId] = {
      id: jobId,
      runAt: new Date(timestamp).toISOString(),
      command,
      idempotencyKey: idempotencyKey || `schedule:${jobId}`,
      status: 'scheduled',
      createdAt: new Date(this.clock()).toISOString()
    };
    await this.stateStore.save();
    await this.eventBus.publish('scheduler.job.scheduled', { ...jobs[jobId] });
    return { ...jobs[jobId] };
  }

  async restore(submit) {
    for (const job of Object.values(this._jobs())) {
      if (job.status === 'scheduled') this._arm(job, submit);
    }
  }

  _arm(job, submit) {
    if (this.timers.has(job.id)) return;
    const delay = Math.max(0, new Date(job.runAt).getTime() - this.clock());
    const timer = setTimeout(async () => {
      this.timers.delete(job.id);
      const jobs = this._jobs();
      const current = jobs[job.id];
      if (!current || current.status !== 'scheduled') return;
      current.status = 'running';
      current.startedAt = new Date(this.clock()).toISOString();
      await this.stateStore.save();
      await this.eventBus.publish('scheduler.job.started', { ...current });
      try {
        const result = await submit(current.command, current.idempotencyKey);
        current.status = 'completed';
        current.result = result;
        current.completedAt = new Date(this.clock()).toISOString();
        await this.eventBus.publish('scheduler.job.completed', { ...current });
      } catch (error) {
        current.status = 'failed';
        current.error = error.message;
        current.failedAt = new Date(this.clock()).toISOString();
        await this.eventBus.publish('scheduler.job.failed', { ...current });
      }
      await this.stateStore.save();
    }, delay);
    this.timers.set(job.id, timer);
  }

  async cancel(id) {
    const jobs = this._jobs();
    const job = jobs[id];
    if (!job) throw new Error(`Unknown scheduled job: ${id}`);
    if (this.timers.has(id)) {
      clearTimeout(this.timers.get(id));
      this.timers.delete(id);
    }
    if (job.status === 'scheduled') {
      job.status = 'cancelled';
      job.cancelledAt = new Date(this.clock()).toISOString();
      await this.stateStore.save();
      await this.eventBus.publish('scheduler.job.cancelled', { ...job });
    }
    return { ...job };
  }

  list() { return Object.values(this._jobs()).map(job => ({ ...job })); }
}

module.exports = Scheduler;
