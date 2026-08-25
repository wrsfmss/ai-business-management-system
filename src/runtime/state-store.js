const fs = require('fs');
const path = require('path');

class StateStore {
  constructor(filePath = path.join(process.cwd(), '.runtime', 'state.json')) {
    this.filePath = filePath;
    this.state = {};
  }

  async load() {
    try {
      this.state = JSON.parse(await fs.promises.readFile(this.filePath, 'utf8'));
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      this.state = {};
    }
    return this.state;
  }

  async save() {
    await fs.promises.mkdir(path.dirname(this.filePath), { recursive: true });
    const tmp = `${this.filePath}.tmp`;
    await fs.promises.writeFile(tmp, JSON.stringify(this.state, null, 2), 'utf8');
    await fs.promises.rename(tmp, this.filePath);
    return this.state;
  }

  get(key, fallback = undefined) { return this.state[key] ?? fallback; }
  set(key, value) { this.state[key] = value; return value; }
  snapshot() { return JSON.parse(JSON.stringify(this.state)); }
}

module.exports = StateStore;
