/**
 * TXBEntity - Base Game Object
 * Everything in your game extends this
 */

class TXBEntity {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
    this.w = 32;
    this.h = 32;
    this.vx = 0;
    this.vy = 0;
    this.rotation = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.color = '#e94560';
    this.alpha = 1;
    this.visible = true;
    this.active = true;
    this.zIndex = 0;
    this.tags = [];
    this.engine = null;

    // Animation
    this.animations = new Map();
    this.currentAnimation = null;
    this.sprite = null;
    this.frameIndex = 0;
    this.animTimer = 0;
  }

  /** Called when added to engine */
  init() {}

  /** Called every frame */
  update(dt, engine) {
    if (!this.active) return;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.updateAnimation(dt);
  }

  /** Called every frame to render */
  render(ctx, engine) {
    if (!this.visible) return;
    const halfW = this.w / 2;
    const halfH = this.h / 2;

    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.translate(this.x + halfW, this.y + halfH);
    ctx.rotate(this.rotation);
    ctx.scale(this.scaleX, this.scaleY);

    if (this.sprite) {
      ctx.drawImage(this.sprite, -halfW, -halfH, this.w, this.h);
    } else {
      ctx.fillStyle = this.color;
      ctx.fillRect(-halfW, -halfH, this.w, this.h);
    }

    ctx.restore();
  }

  /** Called when removed from engine */
  destroy() {}

  // ---- Helpers ----

  getBounds() {
    return {
      x: this.x,
      y: this.y,
      w: this.w,
      h: this.h,
      cx: this.x + this.w / 2,
      cy: this.y + this.h / 2
    };
  }

  distanceTo(other) {
    const dx = (this.x + this.w / 2) - (other.x + other.w / 2);
    const dy = (this.y + this.h / 2) - (other.y + other.h / 2);
    return Math.sqrt(dx * dx + dy * dy);
  }

  containsPoint(px, py) {
    return px >= this.x && px <= this.x + this.w &&
           py >= this.y && py <= this.y + this.h;
  }

  addTag(tag) {
    if (!this.tags.includes(tag)) this.tags.push(tag);
  }

  hasTag(tag) {
    return this.tags.includes(tag);
  }

  // ---- Animation ----

  addAnimation(name, frames, frameRate = 10) {
    this.animations.set(name, { frames, frameRate });
  }

  playAnimation(name) {
    if (this.currentAnimation === name) return;
    this.currentAnimation = name;
    this.frameIndex = 0;
    this.animTimer = 0;
  }

  updateAnimation(dt) {
    if (!this.currentAnimation) return;
    const anim = this.animations.get(this.currentAnimation);
    if (!anim) return;

    this.animTimer += dt;
    const frameDuration = 1 / anim.frameRate;
    if (this.animTimer >= frameDuration) {
      this.animTimer -= frameDuration;
      this.frameIndex = (this.frameIndex + 1) % anim.frames.length;
      this.sprite = anim.frames[this.frameIndex];
    }
  }

  // ---- Factory ----

  static create(opts = {}) {
    const e = new TXBEntity(opts.x || 0, opts.y || 0);
    if (opts.w) e.w = opts.w;
    if (opts.h) e.h = opts.h;
    if (opts.color) e.color = opts.color;
    if (opts.vx) e.vx = opts.vx;
    if (opts.vy) e.vy = opts.vy;
    return e;
  }
}

window.TXBEntity = TXBEntity;
