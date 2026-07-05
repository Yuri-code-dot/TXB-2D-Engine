/**
 * TXBPhysics - 2D Physics System
 * Gravity, velocity, AABB collision detection & resolution
 */

class TXBPhysics {
  constructor(opts = {}) {
    this.gravity = opts.gravity ?? 500;        // pixels/sec^2
    this.friction = opts.friction ?? 0.98;      // velocity multiplier
    this.maxVelocity = opts.maxVelocity ?? 2000;
    this.iterations = opts.iterations ?? 3;     // collision solver iterations
    this.showColliders = opts.showColliders ?? false;
  }

  init(engine) {
    this.engine = engine;
  }

  update(dt, engine) {
    const entities = engine.entities.filter(e => e.active);

    // Apply gravity and friction
    for (const e of entities) {
      if (e.useGravity !== false) {
        e.vy += this.gravity * dt;
      }
      e.vx *= this.friction;
      e.vy *= this.friction;

      // Clamp velocity
      const speed = Math.sqrt(e.vx * e.vx + e.vy * e.vy);
      if (speed > this.maxVelocity) {
        const scale = this.maxVelocity / speed;
        e.vx *= scale;
        e.vy *= scale;
      }
    }

    // AABB Collision detection & resolution
    for (let i = 0; i < this.iterations; i++) {
      for (let a = 0; a < entities.length; a++) {
        for (let b = a + 1; b < entities.length; b++) {
          this.resolveCollision(entities[a], entities[b]);
        }
      }
    }

    // World bounds
    for (const e of entities) {
      if (e.worldBounds !== false) {
        if (e.x < 0) { e.x = 0; e.vx *= -0.5; }
        if (e.y < 0) { e.y = 0; e.vy *= -0.5; }
        if (e.x + e.w > engine.width) { e.x = engine.width - e.w; e.vx *= -0.5; }
        if (e.y + e.h > engine.height) { e.y = engine.height - e.h; e.vy *= -0.5; }
      }
    }
  }

  resolveCollision(a, b) {
    if (a.solid === false || b.solid === false) return;

    const overlapX = Math.min(a.x + a.w - b.x, b.x + b.w - a.x);
    const overlapY = Math.min(a.y + a.h - b.y, b.y + b.h - a.y);

    if (overlapX <= 0 || overlapY <= 0) return;

    // Resolve along smallest overlap axis
    if (overlapX < overlapY) {
      const dir = a.x < b.x ? -1 : 1;
      const push = overlapX / 2;
      a.x += dir * push;
      b.x -= dir * push;
      a.vx *= -0.5;
      b.vx *= -0.5;
    } else {
      const dir = a.y < b.y ? -1 : 1;
      const push = overlapY / 2;
      a.y += dir * push;
      b.y -= dir * push;
      a.vy *= -0.5;
      b.vy *= -0.5;
    }

    a.onCollision?.(b);
    b.onCollision?.(a);
  }

  checkCollision(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x &&
           a.y < b.y + b.h && a.y + a.h > b.y;
  }

  render(ctx, engine) {
    if (!this.showColliders) return;
    ctx.save();
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 1;
    for (const e of engine.entities) {
      if (!e.active) continue;
      ctx.strokeRect(e.x, e.y, e.w, e.h);
    }
    ctx.restore();
  }
}

window.TXBPhysics = TXBPhysics;
