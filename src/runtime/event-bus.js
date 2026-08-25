class EventBus {
  constructor() {
    this.handlers = new Map();
    this.sequence = 0;
    this.history = [];
  }

  subscribe(type, handler) {
    if (!this.handlers.has(type)) this.handlers.set(type, new Set());
    this.handlers.get(type).add(handler);
    return () => this.handlers.get(type)?.delete(handler);
  }

  async publish(type, payload = {}, metadata = {}) {
    const event = {
      id: `${++this.sequence}`,
      type,
      payload,
      metadata,
      occurredAt: new Date().toISOString()
    };
    this.history.push(event);
    for (const handler of this.handlers.get(type) || []) await handler(event);
    return event;
  }

  getHistory() { return [...this.history]; }
}

module.exports = EventBus;
