/**
 * TXBAudio - Audio Manager
 * Wraps HTML5 Audio with volume control, sprite support, and pooling
 */

class TXBAudio {
  constructor(opts = {}) {
    this.masterVolume = opts.masterVolume ?? 1;
    this.muted = opts.muted ?? false;
    this.sounds = new Map();
    this.pools = new Map();
    this.defaultPoolSize = opts.poolSize ?? 4;
  }

  init(engine) {
    this.engine = engine;
  }

  /** Load a sound from URL */
  load(name, src, opts = {}) {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.src = src;
      audio.preload = 'auto';
      audio.addEventListener('canplaythrough', () => {
        this.sounds.set(name, { audio, volume: opts.volume ?? 1 });
        // Create pool for simultaneous playback
        const poolSize = opts.poolSize || this.defaultPoolSize;
        const pool = [];
        for (let i = 0; i < poolSize; i++) {
          pool.push(new Audio(src));
        }
        this.pools.set(name, { pool, index: 0 });
        resolve(name);
      }, { once: true });
      audio.addEventListener('error', reject, { once: true });
    });
  }

  /** Play a sound */
  play(name, opts = {}) {
    if (this.muted) return;
    const sound = this.sounds.get(name);
    if (!sound) {
      console.warn(`TXBAudio: Sound '${name}' not loaded`);
      return;
    }

    const pool = this.pools.get(name);
    if (pool) {
      const audio = pool.pool[pool.index];
      pool.index = (pool.index + 1) % pool.pool.length;
      audio.currentTime = 0;
      audio.volume = (opts.volume ?? sound.volume) * this.masterVolume;
      audio.playbackRate = opts.rate ?? 1;
      audio.play().catch(() => {});
    } else {
      const clone = sound.audio.cloneNode();
      clone.volume = (opts.volume ?? sound.volume) * this.masterVolume;
      clone.playbackRate = opts.rate ?? 1;
      clone.play().catch(() => {});
    }
  }

  /** Stop all instances of a sound */
  stop(name) {
    const pool = this.pools.get(name);
    if (pool) {
      for (const audio of pool.pool) {
        audio.pause();
        audio.currentTime = 0;
      }
    }
  }

  /** Set master volume (0-1) */
  setVolume(v) {
    this.masterVolume = Math.max(0, Math.min(1, v));
  }

  /** Toggle mute */
  toggleMute() {
    this.muted = !this.muted;
  }

  /** Load multiple sounds */
  async loadBatch(sounds) {
    const promises = sounds.map(s => this.load(s.name, s.src, s));
    return Promise.all(promises);
  }

  update() {} // Audio doesn't update per frame
  render() {} // Audio doesn't render
}

window.TXBAudio = TXBAudio;
