/**
 * ============================================================================
 * PAJULGAN — Architecture & Engineering
 * Complete Motion Framework: Scroll Physics, Animation Timing & Interactive Movement
 * File: js/core/motion.js
 * ============================================================================
 *
 * Senior Mentorship Architecture Note:
 *
 * 1st — Foundation Code: Physics Solvers & Mathematical Curves
 * - Newton-Raphson polynomial solver for cubic-bezier(0.16, 1, 0.3, 1) and agile mobile curves.
 * - Damped harmonic spring physics solver for weightless interactive settling.
 * - Device detection & adaptive physics profile manager (Desktop wheel vs Mobile touch).
 *
 * 2nd — Core Functionality: Scroll Physics Engine & Velocity Observer
 * - Instantaneous velocity calculation (v = dy / dt) and smoothed low-pass filtering.
 * - Direction detection with hysteresis to prevent touch flutter.
 * - Dynamic velocity-scaled animation timing (faster scroll = snappier animations, eliminating "heavy" feel).
 *
 * 3rd — Enhancement, Animation & Optimization: Interactive Movement Controller
 * - Architectural split-line heading reveals with hardware-accelerated masks.
 * - Velocity-reactive momentum transforms for tactile responsiveness.
 * - Unified 60/120 FPS requestAnimationFrame scheduler with lag-smoothing.
 *
 * Why this code exists:
 * Default mobile touch scrolling feels "heavy" when JavaScript intercepts touchmove with high
 * artificial friction and low lerp rates. This framework builds an adaptive physics engine that
 * eliminates all drag resistance on mobile while coordinating animation timing and interactive
 * movement across the entire document.
 *
 * Tricky logic:
 * On high-refresh mobile displays (90Hz-120Hz), touch events fire faster than standard 60Hz.
 * The physics engine smooths velocity using an exponential moving average (EMA) to prevent
 * jitter while dynamically scaling animation durations inversely with scroll velocity.
 *
 * TODO: Add gyroscope-assisted micro-parallax on mobile devices with DeviceOrientation API.
 */

// ============================================================================
// 1st — Foundation Code: Physics Solvers & Mathematical Curves
// ============================================================================

// STEP 1: High-Precision Cubic-Bezier Polynomial Solver
export function solveCubicBezier(x1, y1, x2, y2) {
  const ax = 1 - 3 * x2 + 3 * x1;
  const bx = 3 * x2 - 6 * x1;
  const cx = 3 * x1;

  const ay = 1 - 3 * y2 + 3 * y1;
  const by = 3 * y2 - 6 * y1;
  const cy = 3 * y1;

  function sampleCurveX(t) { return ((ax * t + bx) * t + cx) * t; }
  function sampleCurveY(t) { return ((ay * t + by) * t + cy) * t; }
  function sampleCurveDerivativeX(t) { return (3 * ax * t + 2 * bx) * t + cx; }

  function solveCurveX(x) {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    // 8 Newton-Raphson iterations for sub-microsecond convergence
    for (let i = 0; i < 8; i++) {
      const xSample = sampleCurveX(t) - x;
      if (Math.abs(xSample) < 1e-6) return t;
      const dX = sampleCurveDerivativeX(t);
      if (Math.abs(dX) < 1e-6) break;
      t -= xSample / dX;
    }
    // Binary subdivision fallback
    let t0 = 0, t1 = 1;
    t = x;
    while (t0 < t1) {
      const xSample = sampleCurveX(t);
      if (Math.abs(xSample - x) < 1e-6) return t;
      if (x > xSample) t0 = t; else t1 = t;
      t = (t1 + t0) * 0.5;
      if (t1 - t0 < 1e-6) break;
    }
    return t;
  }

  return function (x) { return sampleCurveY(solveCurveX(x)); };
}

// STEP 2: Damped Harmonic Oscillator (Spring Physics Solver)
// Why: Provides natural, organic settling without mechanical rigidity.
export function createSpringSolver(stiffness = 120, damping = 14, mass = 1) {
  const omega0 = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));

  return function (t) {
    if (t >= 1) return 1;
    if (zeta < 1) {
      // Underdamped spring
      const omegaD = omega0 * Math.sqrt(1 - zeta * zeta);
      const decay = Math.exp(-zeta * omega0 * t);
      return 1 - decay * (Math.cos(omegaD * t) + (zeta / Math.sqrt(1 - zeta * zeta)) * Math.sin(omegaD * t));
    }
    // Critically damped or overdamped fallback
    return 1 - (1 + omega0 * t) * Math.exp(-omega0 * t);
  };
}

// STEP 3: Centralized Motion Timing & Curves
export const MOTION_TIMING = {
  curves: {
    // Cinematic luxury curve for desktop momentum and section transitions
    cinematic: solveCubicBezier(0.16, 1, 0.3, 1),
    // Agile, weightless curve for mobile touch interactions
    agile: solveCubicBezier(0.22, 1, 0.36, 1),
    // Fluid standard ease
    fluid: solveCubicBezier(0.25, 1, 0.5, 1),
    // Spring physics curve
    spring: createSpringSolver(140, 16, 1),
    linear: (t) => t
  },
  durations: {
    quick: 0.35,
    base: 0.75,
    extended: 1.15,
    cinematic: 1.55
  }
};

// ============================================================================
// 2nd — Core Functionality: Adaptive Scroll Physics Engine
// ============================================================================

// STEP 1: Device Input Modality Detector
// Why: Desktop trackpads/wheels require inertial smoothing; mobile touch requires
// 0ms drag resistance and direct compositor agility.
export function isTouchDevice() {
  if (typeof window === 'undefined') return false;
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia('(pointer: coarse)').matches
  );
}

// STEP 2: Real-time Physics State Manager
export class ScrollPhysicsEngine {
  constructor() {
    this.y = 0;
    this.lastY = 0;
    this.lastTimestamp = performance.now();
    this.velocity = 0;
    this.smoothedVelocity = 0;
    this.direction = 1; // 1: down, -1: up
    this.isScrolling = false;
    this.idleTimer = null;
    this.subscribers = new Set();
    this.isTouch = isTouchDevice();
  }

  // Update physics variables on every scroll frame
  update(currentY) {
    const now = performance.now();
    const dt = Math.max(1, now - this.lastTimestamp);
    const dy = currentY - this.lastY;

    // Instantaneous velocity (px/ms)
    const rawVelocity = dy / dt;

    // Exponential Moving Average (EMA) smoothing for stable velocity tracking
    const alpha = 0.25;
    this.smoothedVelocity = alpha * rawVelocity + (1 - alpha) * this.smoothedVelocity;
    this.velocity = rawVelocity;

    // Direction hysteresis: Only change direction if movement exceeds micro-threshold
    if (Math.abs(dy) > 1.5) {
      this.direction = dy > 0 ? 1 : -1;
    }

    this.y = currentY;
    this.lastY = currentY;
    this.lastTimestamp = now;

    if (!this.isScrolling && Math.abs(rawVelocity) > 0.02) {
      this.isScrolling = true;
      this.notifyStateChange(true);
    }

    clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(() => {
      this.isScrolling = false;
      this.velocity = 0;
      this.smoothedVelocity = 0;
      this.notifyStateChange(false);
    }, 140);

    // Notify registered subscribers
    for (const sub of this.subscribers) {
      sub({
        y: this.y,
        velocity: this.velocity,
        smoothedVelocity: this.smoothedVelocity,
        direction: this.direction,
        isScrolling: this.isScrolling,
        isTouch: this.isTouch
      });
    }
  }

  notifyStateChange(active) {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.dataset.scrolling = active ? 'true' : 'false';
    root.dataset.scrollDirection = this.direction === 1 ? 'down' : 'up';
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  // Dynamic timing adjustment: Scales duration inversely with velocity
  // Why: When user scrolls fast, animations speed up proportionally so the site feels light!
  getDynamicDuration(baseDuration = 1.0) {
    const v = Math.abs(this.smoothedVelocity);
    const speedFactor = 1 + Math.min(2.5, v * 0.8);
    return Math.max(0.35, baseDuration / speedFactor);
  }
}

export const physicsEngine = new ScrollPhysicsEngine();

// ============================================================================
// 3rd — Enhancement, Animation & Optimization: Interactive Movement Presets
// ============================================================================

// STEP 1: Architectural Split-Line Heading Reveal Preset
export function splitLineReveal(element, triggerStart = 'top 85%', options = {}) {
  if (!element || typeof window.gsap === 'undefined') return;

  const rawHtml = element.innerHTML.trim();
  const lines = rawHtml.split(/<br\s*\/?>/i);

  if (lines.length > 1) {
    element.innerHTML = lines
      .map((line) => `<span class="motion-line"><span class="motion-line-inner">${line.trim()}</span></span>`)
      .join('');

    const inners = element.querySelectorAll('.motion-line-inner');
    window.gsap.fromTo(
      inners,
      {
        yPercent: 110,
        rotateX: 4,
        opacity: 0
      },
      {
        yPercent: 0,
        rotateX: 0,
        opacity: 1,
        duration: options.duration || MOTION_TIMING.durations.extended,
        stagger: 0.1,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: element,
          start: triggerStart,
          toggleActions: 'play none none reverse'
        }
      }
    );
  } else {
    window.gsap.fromTo(
      element,
      { y: 40, opacity: 0, scale: 0.98 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: options.duration || MOTION_TIMING.durations.extended,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: element,
          start: triggerStart,
          toggleActions: 'play none none reverse'
        }
      }
    );
  }
}
