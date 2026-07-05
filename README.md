# TXB-2D-Engine

A lightweight 2D game engine built from scratch using pure HTML, CSS, and JavaScript. Designed for browser-based games with rendering, physics, animation, input handling, audio, and mobile support—no external frameworks required.

## Quick Start

```html
<canvas id="game"></canvas>
<script src="src/engine.js"></script>
<script src="src/renderer.js"></script>
<script src="src/input.js"></script>
<script src="src/physics.js"></script>
<script src="src/entity.js"></script>
<script src="src/audio.js"></script>
<script>
  const engine = new TXBEngine('game', {
    width: 800,
    height: 600,
    backgroundColor: '#1a1a2e',
    showFps: true
  });

  engine
    .addSystem(new TXBRenderer())
    .addSystem(new TXBInput())
    .addSystem(new TXBPhysics())
    .addEntity(TXBEntity.create({ x: 100, y: 100, w: 50, h: 50, color: '#e94560' }))
    .start();
</script>
```

## Systems

| System | File | What it does |
|--------|------|-------------|
| **Engine** | `engine.js` | Game loop, delta time, FPS counter, scene management |
| **Renderer** | `renderer.js` | 2D canvas primitives, camera, screen shake, parallax backgrounds |
| **Input** | `input.js` | Keyboard, mouse, and touch input with unified API |
| **Physics** | `physics.js` | Gravity, velocity, friction, AABB collision detection & resolution |
| **Entity** | `entity.js` | Base game object with position, velocity, rotation, animations, tags |
| **Audio** | `audio.js` | Sound loading, playback pooling, volume control, pitch shifting |

## Demo

Open `examples/bouncing-box.html` in your browser for a live demo featuring:
- Player movement with WASD / Arrow keys
- Jumping with Space / W / Up
- Gravity and collision physics
- Click/tap to spawn colorful bouncing boxes
- Particle effects on spawn
- Screen shake on jump
- Mobile touch support

## API Overview

### Engine
- `engine.addEntity(entity)` — add a game object
- `engine.addSystem(system)` — register a system
- `engine.start()` / `engine.stop()` — control the game loop
- `engine.resize(w, h)` — resize the canvas

### Entity
- `entity.x`, `entity.y` — position
- `entity.vx`, `entity.vy` — velocity
- `entity.rotation`, `entity.scaleX/Y` — transform
- `entity.update(dt, engine)` — override for custom logic
- `entity.render(ctx, engine)` — override for custom drawing
- `entity.addTag('enemy')` / `entity.hasTag('enemy')`

### Input
- `input.isKey('KeyW')` — is key held
- `input.isKeyPressed('Space')` — key just pressed this frame
- `input.isMouseDown()` / `input.isMousePressed()`
- `input.getTouches()` — array of active touch points

### Physics
- Set `entity.useGravity = false` to exclude from gravity
- Set `entity.solid = false` to disable collisions
- Set `entity.worldBounds = false` to disable boundary clamping
- `entity.onCollision = (other) => {}` — collision callback

### Renderer
- `renderer.setCamera(x, y)` — move camera
- `renderer.shake(intensity, duration)` — screen shake
- Drawing helpers: `drawRect`, `drawCircle`, `drawText`, `drawImage`, `drawLine`

## License

MIT — build cool stuff with it 🎮
