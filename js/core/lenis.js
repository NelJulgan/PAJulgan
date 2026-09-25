/**
 * ============================================================================
 * 1st — Foundation Code: Ultra-Smooth Momentum Scrolling Engine & Physics Solver
 * File: js/core/lenis.js
 * ============================================================================
 *
 * Senior Mentorship Architecture Note:
 *
 * 1st — Foundation Code
 * - Mathematical cubic-bezier(0.16, 1, 0.3, 1) solver for physics-based easing.
 * - Lenis 1.3+ smooth momentum scroll engine initialization.
 * - Dynamic scroll velocity tracking & HTML dataset attribute dispatch.
 * - Direct GSAP requestAnimationFrame ticker synchronization with lag-smoothing.
 *
 * Why this code exists:
 * Default browser scrolling is mechanically notched, abrupt, and tied to coarse mousewheel
 * steps or platform-dependent touch physics. To create an award-winning, cinematic Awwwards/Apple-grade
 * interactive experience, we replace native scroll dispatch with a weight-based momentum model.
 *
 * Tricky logic:
 * 1. Synchronizing Lenis with GSAP's ticker requires driving `lenis.raf(time * 1000)` inside GSAP's
 *    ticker callback, and piping `lenis.on('scroll', ScrollTrigger.update)`. This locks visual transforms
 *    and scroll coordinates to the exact same render frame, eliminating visual jitter at 60/120 FPS.
 * 2. Newton-Raphson polynomial solver executes in <1 microsecond, providing the exact mathematical
 *    curve of CSS `cubic-bezier(0.16, 1, 0.3, 1)` to JS interpolation loops.
 * 3. Mobile touch devices require `syncTouch: true` with gentle momentum interpolation (`syncTouchLerp: 0.08`)
 *    so finger touches track 1:1 during active dragging without rubber-banding halts.
 *
 * TODO: Integrate subtle sound design or haptic feedback for wheel clicks on supported tactile devices.
 */

// STEP 1: Mathematical Cubic-Bezier Easing Solver (cubic-bezier(0.16, 1, 0.3, 1))
// Why: Generates an ultra-luxurious, weight-based acceleration and long deceleration tail.
export function solveCubicBezier(x1, y1, x2, y2) {
  const ax = 1 - 3 * x2 + 3 * x1;
  const bx = 3 * x2 - 6 * x1;
  const cx = 3 * x1;

  const ay = 1 - 3 * y2 + 3 * y1;
  const by = 3 * y2 - 6 * y1;
  const cy = 3 * y1;

  function sampleCurveX(t) {
    return ((ax * t + bx) * t + cx) * t;
  }
  function sampleCurveY(t) {
    return ((ay * t + by) * t + cy) * t;
  }
  function sampleCurveDerivativeX(t) {
    return (3 * ax * t + 2 * bx) * t + cx;
  }

  function solveCurveX(x) {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    // 8 Newton-Raphson iterations for sub-millisecond convergence
    for (let i = 0; i < 8; i++) {
      const xSample = sampleCurveX(t) - x;
      if (Math.abs(xSample) < 1e-6) return t;
      const dX = sampleCurveDerivativeX(t);
      if (Math.abs(dX) < 1e-6) break;
      t -= xSample / dX;
    }
    // Binary subdivision fallback in case derivative vanishes
    let t0 = 0;
    let t1 = 1;
    t = x;
    while (t0 < t1) {
      const xSample = sampleCurveX(t);
      if (Math.abs(xSample - x) < 1e-6) return t;
      if (x > xSample) t0 = t;
      else t1 = t;
      t = (t1 + t0) * 0.5;
      if (t1 - t0 < 1e-6) break;
    }
    return t;
  }

  return function (x) {
    return sampleCurveY(solveCurveX(x));
  };
}

// Master Cinematic Easing Function (cubic-bezier(0.16, 1, 0.3, 1))
export const cinematicEase = solveCubicBezier(0.16, 1, 0.3, 1);

let lenisInstance = null;
let currentVelocity = 0;
let isScrollingActive = false;
let scrollEndTimer = null;

// STEP 2: Initialize Lenis Smooth Scrolling Engine with Velocity & Momentum
export function initLenis() {
  if (typeof window === 'undefined' || !window.Lenis) {
    console.warn('[Motion] Lenis engine unavailable. Falling back to native scrolling.');
    return null;
  }

  // STEP 3: Configure Weight-Based Physics & Device Adaptations
  lenisInstance = new window.Lenis({
    duration: 1.3, // Weight-based glide duration
    easing: cinematicEase, // Cinematic cubic-bezier(0.16, 1, 0.3, 1) curve
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.95, // Calibrated to eliminate coarse mouse-wheel notches
    syncTouch: true, // Seamless 1:1 mobile touch tracking with inertia
    syncTouchLerp: 0.08, // Buttery drag-and-glide momentum interpolation
    touchInertiaExponent: 1.65, // Gentle deceleration curve upon finger release
    touchMultiplier: 1.0, // Prevents overshooting and screen jumping
    infinite: false,
    anchors: false,
    overscroll: true
  });

  const rootDoc = document.documentElement;

  // STEP 4: Real-time Velocity & Direction State Tracking
  lenisInstance.on('scroll', (event) => {
    // 1. Frame-lock coordinates with GSAP ScrollTrigger
    if (window.ScrollTrigger) {
      window.ScrollTrigger.update();
    }

    // 2. Track velocity for velocity-aware motion effects
    currentVelocity = event.velocity || 0;
    const direction = event.direction === 1 ? 'down' : 'up';

    if (rootDoc.dataset.scrollDirection !== direction) {
      rootDoc.dataset.scrollDirection = direction;
    }

    if (!isScrollingActive && Math.abs(currentVelocity) > 0.05) {
      isScrollingActive = true;
      rootDoc.dataset.scrolling = 'true';
    }

    // Debounce scroll idle state
    clearTimeout(scrollEndTimer);
    scrollEndTimer = setTimeout(() => {
      isScrollingActive = false;
      rootDoc.dataset.scrolling = 'false';
    }, 120);
  });

  // STEP 5: Optimize Performance with GSAP Ticker & Lag-Smoothing
  if (window.gsap) {
    // Drive Lenis strictly through GSAP's internal RAF ticker
    window.gsap.ticker.add((time) => {
      lenisInstance.raf(time * 1000);
    });

    // Lag smoothing cushions CPU/GPU spikes without sudden viewport freezes
    window.gsap.ticker.lagSmoothing(500, 33);
  }

  return lenisInstance;
}

export function getLenis() {
  return lenisInstance;
}

export function getScrollVelocity() {
  return currentVelocity;
}
