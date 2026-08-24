const fs = require('fs/promises');
const path = require('path');

class StateStore {
  constructor(options = {}) {
    this.filePath = options.filePath || path.join(process.cwd(), '.runtime', 'state.json');
    this.state = options.initialState ? structuredClone(options.initialState) : {};
  }

  get(key, fallback = undefined) {
    return key in this.state ? this.state[key] : fallback;
  }

  set(key, value) {
    this.state[key] = value;
    return value;
  }

  snapshot() {
    return structuredClone(this.state);
  }

  async save() {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    const temporaryPath = `${this.filePath}.tmp`;
    await fs.writeFile(temporaryPath, JSON.stringify(this.state, null, 2), 'utf8');
    await fs.rename(temporaryPath, this.filePath);
    return this.snapshot();
  }

  async load() {
    try {
      const raw = await fs.readFile(this.filePath, 'utf8');
      this.state = JSON.parse(raw);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
    return this.snapshot();
  }

  async persist() {
    return this.save();
  }

  async restore() {
    return this.load();
  }
}

module.exports = StateStore;
module.exports.StateStore = StateStore;
