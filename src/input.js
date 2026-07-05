/**
 * TXBInput - Input Handling System
 * Keyboard + Mouse + Touch, unified API
 */

class TXBInput {
  constructor() {
    this.keys = new Map();
    this.keysPressed = new Map();    // Just pressed this frame
    this.keysReleased = new Map();   // Just released this frame

    this.mouse = { x: 0, y: 0, down: false, pressed: false, released: false };
    this.touches = new Map();        // id -> {x, y, down}

    this.boundKeyDown = this.onKeyDown.bind(this);
    this.boundKeyUp = this.onKeyUp.bind(this);
    this.boundMouseDown = this.onMouseDown.bind(this);
    this.boundMouseUp = this.onMouseUp.bind(this);
    this.boundMouseMove = this.onMouseMove.bind(this);
    this.boundTouchStart = this.onTouchStart.bind(this);
    this.boundTouchEnd = this.onTouchEnd.bind(this);
    this.boundTouchMove = this.onTouchMove.bind(this);
  }

  init(engine) {
    this.engine = engine;
    this.canvas = engine.canvas;

    window.addEventListener('keydown', this.boundKeyDown);
    window.addEventListener('keyup', this.boundKeyUp);
    this.canvas.addEventListener('mousedown', this.boundMouseDown);
    window.addEventListener('mouseup', this.boundMouseUp);
    this.canvas.addEventListener('mousemove', this.boundMouseMove);
    this.canvas.addEventListener('touchstart', this.boundTouchStart, { passive: false });
    window.addEventListener('touchend', this.boundTouchEnd);
    this.canvas.addEventListener('touchmove', this.boundTouchMove, { passive: false });
  }

  // ---- Keyboard ----

  onKeyDown(e) {
    if (!this.keys.has(e.code)) {
      this.keysPressed.set(e.code, true);
    }
    this.keys.set(e.code, true);
    e.preventDefault();
  }

  onKeyUp(e) {
    this.keys.set(e.code, false);
    this.keysReleased.set(e.code, true);
  }

  /** Is key currently held */
  isKey(code) {
    return !!this.keys.get(code);
  }

  /** Was key just pressed this frame */
  isKeyPressed(code) {
    return !!this.keysPressed.get(code);
  }

  /** Was key just released this frame */
  isKeyReleased(code) {
    return !!this.keysReleased.get(code);
  }

  // ---- Mouse ----

  onMouseDown(e) {
    this.updateMousePos(e);
    this.mouse.down = true;
    this.mouse.pressed = true;
  }

  onMouseUp() {
    this.mouse.down = false;
    this.mouse.released = true;
  }

  onMouseMove(e) {
    this.updateMousePos(e);
  }

  updateMousePos(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    this.mouse.x = (e.clientX - rect.left) * scaleX;
    this.mouse.y = (e.clientY - rect.top) * scaleY;
  }

  isMouseDown() { return this.mouse.down; }
  isMousePressed() { return this.mouse.pressed; }
  isMouseReleased() { return this.mouse.released; }

  // ---- Touch ----

  onTouchStart(e) {
    e.preventDefault();
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    for (const touch of e.changedTouches) {
      this.touches.set(touch.identifier, {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
        down: true
      });
    }
  }

  onTouchEnd(e) {
    for (const touch of e.changedTouches) {
      this.touches.delete(touch.identifier);
    }
  }

  onTouchMove(e) {
    e.preventDefault();
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    for (const touch of e.changedTouches) {
      const t = this.touches.get(touch.identifier);
      if (t) {
        t.x = (touch.clientX - rect.left) * scaleX;
        t.y = (touch.clientY - rect.top) * scaleY;
      }
    }
  }

  getTouches() {
    return Array.from(this.touches.values());
  }

  // ---- Lifecycle ----

  update() {
    this.keysPressed.clear();
    this.keysReleased.clear();
    this.mouse.pressed = false;
    this.mouse.released = false;
  }

  destroy() {
    window.removeEventListener('keydown', this.boundKeyDown);
    window.removeEventListener('keyup', this.boundKeyUp);
    this.canvas.removeEventListener('mousedown', this.boundMouseDown);
    window.removeEventListener('mouseup', this.boundMouseUp);
    this.canvas.removeEventListener('mousemove', this.boundMouseMove);
    this.canvas.removeEventListener('touchstart', this.boundTouchStart);
    window.removeEventListener('touchend', this.boundTouchEnd);
    this.canvas.removeEventListener('touchmove', this.boundTouchMove);
  }
}

window.TXBInput = TXBInput;
