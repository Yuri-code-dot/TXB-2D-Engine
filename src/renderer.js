/**
 * TXBRenderer - 2D Rendering System
 * Wraps canvas 2D context with convenient drawing methods
 */

class TXBRenderer {
  constructor() {
    this.camera = { x: 0, y: 0, zoom: 1, rotation: 0 };
    this.shakeIntensity = 0;
    this.shakeTimer = 0;
  }

  init(engine) {
    this.engine = engine;
  }

  /** Set camera position */
  setCamera(x, y) {
    this.camera.x = x;
    this.camera.y = y;
  }

  /** Apply camera transform to context */
  applyCamera(ctx) {
    ctx.save();
    ctx.translate(this.engine.width / 2, this.engine.height / 2);
    ctx.scale(this.camera.zoom, this.camera.zoom);
    ctx.rotate(this.camera.rotation);
    ctx.translate(-this.camera.x, -this.camera.y);

    if (this.shakeTimer > 0) {
      const sx = (Math.random() - 0.5) * this.shakeIntensity;
      const sy = (Math.random() - 0.5) * this.shakeIntensity;
      ctx.translate(sx, sy);
      this.shakeTimer -= this.engine.deltaTime;
    }
  }

  /** Reset camera transform */
  resetCamera(ctx) {
    ctx.restore();
  }

  /** Screen shake effect */
  shake(intensity = 5, duration = 0.3) {
    this.shakeIntensity = intensity;
    this.shakeTimer = duration;
  }

  update() {} // Renderer doesn't update

  render(ctx, engine) {
    // Camera is applied per-entity, so nothing global here
  }

  // ---- Drawing Primitives ----

  drawRect(ctx, x, y, w, h, color, opts = {}) {
    ctx.save();
    ctx.fillStyle = color;
    if (opts.alpha !== undefined) ctx.globalAlpha = opts.alpha;
    if (opts.rotation) {
      ctx.translate(x + w / 2, y + h / 2);
      ctx.rotate(opts.rotation);
      ctx.fillRect(-w / 2, -h / 2, w, h);
    } else {
      ctx.fillRect(x, y, w, h);
    }
    if (opts.stroke) {
      ctx.strokeStyle = opts.strokeColor || '#fff';
      ctx.lineWidth = opts.strokeWidth || 1;
      ctx.strokeRect(x, y, w, h);
    }
    ctx.restore();
  }

  drawCircle(ctx, x, y, r, color, opts = {}) {
    ctx.save();
    ctx.fillStyle = color;
    if (opts.alpha !== undefined) ctx.globalAlpha = opts.alpha;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    if (opts.stroke) {
      ctx.strokeStyle = opts.strokeColor || '#fff';
      ctx.lineWidth = opts.strokeWidth || 1;
      ctx.stroke();
    }
    ctx.restore();
  }

  drawText(ctx, text, x, y, opts = {}) {
    ctx.save();
    ctx.fillStyle = opts.color || '#fff';
    ctx.font = opts.font || '16px sans-serif';
    ctx.textAlign = opts.align || 'left';
    ctx.textBaseline = opts.baseline || 'top';
    if (opts.alpha !== undefined) ctx.globalAlpha = opts.alpha;
    if (opts.shadow) {
      ctx.shadowColor = opts.shadowColor || 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = opts.shadowBlur || 4;
    }
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  drawImage(ctx, image, x, y, w, h, opts = {}) {
    ctx.save();
    if (opts.alpha !== undefined) ctx.globalAlpha = opts.alpha;
    if (opts.rotation) {
      ctx.translate(x + w / 2, y + h / 2);
      ctx.rotate(opts.rotation);
      ctx.drawImage(image, -w / 2, -h / 2, w, h);
    } else {
      ctx.drawImage(image, x, y, w, h);
    }
    ctx.restore();
  }

  drawLine(ctx, x1, y1, x2, y2, color, width = 1) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  }

  /** Draw a tiled background */
  drawTileBackground(ctx, image, tileW, tileH, parallaxX = 0, parallaxY = 0) {
    const offsetX = -(this.camera.x * parallaxX) % tileW;
    const offsetY = -(this.camera.y * parallaxY) % tileH;
    for (let x = offsetX - tileW; x < this.engine.width + tileW; x += tileW) {
      for (let y = offsetY - tileH; y < this.engine.height + tileH; y += tileH) {
        ctx.drawImage(image, x, y, tileW, tileH);
      }
    }
  }
}

window.TXBRenderer = TXBRenderer;
