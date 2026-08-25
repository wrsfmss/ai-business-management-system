class MemoryStore {
  constructor(stateStore) {
    this.stateStore = stateStore;
    this.items = stateStore.get('memory', []);
  }

  async remember(value, metadata = {}) {
    const item = { id: `${Date.now()}-${this.items.length + 1}`, value, metadata, createdAt: new Date().toISOString() };
    this.items.push(item);
    this.stateStore.set('memory', this.items);
    await this.stateStore.save();
    return item;
  }

  search(predicate) { return this.items.filter(predicate); }
  all() { return [...this.items]; }
}

module.exports = MemoryStore;
