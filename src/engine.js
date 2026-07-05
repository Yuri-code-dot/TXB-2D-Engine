/**
 * TXBEngine - Core 2D Game Engine
 * Pure vanilla JS, no dependencies
 */

class TXBEngine {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      throw new Error(`TXBEngine: Canvas #${canvasId} not found`);
    }

    this.ctx = this.canvas.getContext('2d');
    this.width = options.width || 800;
    this.height = options.height || 600;
    this.backgroundColor = options.backgroundColor || '#1a1a2e';

    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.entities = [];
    this.systems = [];
    this.running = false;
    this.lastTime = 0;
    this.deltaTime = 0;
    this.fps = 0;
    this.frameCount = 0;
    this.fpsTimer = 0;
    this.showFps = options.showFps !== false;

    this.input = null;
    this.renderer = null;
    this.physics = null;
    this.audio = null;
  }

  /** Register a system (renderer, physics, input, audio) */
  addSystem(system) {
    this.systems.push(system);
    system.init?.(this);
    return this;
  }

  /** Add an entity to the engine */
  addEntity(entity) {
    entity.engine = this;
    entity.init?.();
    this.entities.push(entity);
    return this;
  }

  /** Remove an entity */
  removeEntity(entity) {
    const idx = this.entities.indexOf(entity);
    if (idx > -1) {
      entity.destroy?.();
      this.entities.splice(idx, 1);
    }
    return this;
  }

  /** Clear all entities */
  clearEntities() {
    this.entities.forEach(e => e.destroy?.());
    this.entities = [];
    return this;
  }

  /** Main game loop */
  loop = (timestamp) => {
    if (!this.running) return;

    this.deltaTime = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;

    // Cap delta to avoid spiral of death on tab switch
    if (this.deltaTime > 0.1) this.deltaTime = 0.1;

    this.update(this.deltaTime);
    this.render(this.ctx);
    this.frameCount++;

    // FPS counter
    this.fpsTimer += this.deltaTime;
    if (this.fpsTimer >= 1) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.fpsTimer = 0;
    }

    requestAnimationFrame(this.loop);
  };

  /** Update all systems and entities */
  update(dt) {
    for (const system of this.systems) {
      system.update?.(dt, this);
    }
    for (const entity of this.entities) {
      entity.update?.(dt, this);
    }
  }

  /** Render everything */
  render(ctx) {
    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(0, 0, this.width, this.height);

    for (const system of this.systems) {
      system.render?.(ctx, this);
    }
    for (const entity of this.entities) {
      entity.render?.(ctx, this);
    }

    if (this.showFps) {
      ctx.fillStyle = '#00ff88';
      ctx.font = '14px monospace';
      ctx.fillText(`${this.fps} FPS`, 10, 20);
    }
  }

  /** Start the engine */
  start() {
    if (this.running) return this;
    this.running = true;
    this.lastTime = performance.now();
    requestAnimationFrame(this.loop);
    return this;
  }

  /** Stop the engine */
  stop() {
    this.running = false;
    return this;
  }

  /** Pause toggle */
  togglePause() {
    this.running ? this.stop() : this.start();
    return this;
  }

  /** Resize canvas */
  resize(w, h) {
    this.width = w;
    this.height = h;
    this.canvas.width = w;
    this.canvas.height = h;
    return this;
  }
}

// Factory
window.TXBEngine = TXBEngine;
